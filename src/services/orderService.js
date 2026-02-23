import {Order} from "../db/models/OrderModel.js"
import getCounty from "../utils/getCountry.js"
import calculateTax  from "../utils/calculateTax.js";

export const getAllOrdersService = async ()=>{
    return await Order.findAll()
}   



export const createOrderService = async (payload) => {
  const { latitude, longitude, subtotal } = payload;

  if (latitude == null || longitude == null) {
    throw new Error("Latitude and longitude are required");
  }

  const countyName = getCounty(latitude, longitude);
  if (!countyName) {
    throw new Error("Cannot determine county from given coordinates");
  }

  const taxData = calculateTax(subtotal, countyName);

  const orderPayload = {
    ...payload,
    county_name: countyName,
    composite_tax_rate: taxData.composite_tax_rate,
    tax_amount: taxData.tax_amount,
    total_amount: taxData.total_amount,
    state_rate: taxData.breakdown.state_rate,
    county_rate: taxData.breakdown.county_rate,
    city_rate: taxData.breakdown.city_rate,
    special_rates: taxData.breakdown.special_rate,
    tax_breakdown: taxData.breakdown, 
  };

  const newOrder = await Order.create(orderPayload);
  return newOrder;
};