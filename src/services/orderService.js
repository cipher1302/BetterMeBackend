import {Order} from "../db/models/OrderModel.js"
import getCounty from "../utils/getCountry.js"
import calculateTax  from "../utils/calculateTax.js";
import pagination from "../utils/paginationUtils.js"
import buildFilterQuery from "../utils/filterUtil.js";

export const getAllOrdersService = async ({page=1,limit=5,filters={}})=>{
    const where = buildFilterQuery(filters);
    const orders = await pagination(Order,page,limit,where)
    return orders
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
export const importOrdersService = async (orders) => {
  const processed = orders
    .map((order, i) => {
      const lat = parseFloat(order.latitude);
      const lng = parseFloat(order.longitude);
      const sub = parseFloat(order.subtotal);

      if (isNaN(lat) || isNaN(lng) || isNaN(sub)) {
        console.warn(`Order #${i} has invalid number(s), skipping`);
        return null;
      }

      const countyName = getCounty(lat, lng);
      if (!countyName) {
        console.warn(`Order #${i} could not determine county`);
        return null;
      }

      const taxData = calculateTax(sub, countyName);
      if (!taxData) {
        console.warn(`Order #${i} tax calculation failed`);
        return null;
      }


      return {
        ...order,
        latitude: lat,
        longitude: lng,
        subtotal: sub,
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
    })
    .filter(Boolean);

  const processedWithoutId = processed.map(({ id, ...rest }) => rest);
  return await Order.bulkCreate(processedWithoutId, {
    validate: true,
    returning: true,
  });
};