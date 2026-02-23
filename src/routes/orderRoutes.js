import { Router } from "express";
import { showAllOrders,createOrder } from "../controllers/orderController.js";


const router = Router()


router.get('/',showAllOrders)
router.post("/",createOrder)
// router.post("/import")


export default router