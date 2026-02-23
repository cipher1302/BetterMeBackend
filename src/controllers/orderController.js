import { asyncHandler } from "../utils/asyncHandler.js"
import { getAllOrdersService,createOrderService } from "../services/orderService.js"

export const showAllOrders = asyncHandler(async (req,res)=>{
    const orders = await getAllOrdersService()
    return res.json({
        message:"Orders found successfully",
        data:orders,
    })
})

export const createOrder = asyncHandler(async (req,res)=>{
    const payload = req.body
    const newOrder = await createOrderService(payload)
    return res.json({
        message:"Order created successfully",
        data:newOrder,
    })
})