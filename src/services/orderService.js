import {Order} from "../db/models/OrderModel.js"

export const getAllOrdersService = async ()=>{
    return await Order.findAll()
}   

export const createOrderService = async(payload)=>{
    return await Order.create(payload)
}