import { asyncHandler } from "../utils/asyncHandler.js"
import { getAllOrdersService,createOrderService, importOrdersService } from "../services/orderService.js"

export const showAllOrders = asyncHandler(async (req,res)=>{
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const orders = await getAllOrdersService({page,limit})
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

export const importOrders = asyncHandler(async (req,res)=>{
    const csvData = req.csvData
    if (!csvData || csvData.length === 0) {
      return res.status(400).json({ message: 'CSV empty or not loaded' });
    }
    await importOrdersService(csvData)

    return res.json({ message: 'CSV imported successfully' });
})