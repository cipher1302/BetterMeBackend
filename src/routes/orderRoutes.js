import { Router } from "express";
import { showAllOrders } from "../controllers/orderController.js";


const router = Router()


router.get('/',showAllOrders)
// router.post("/")
// router.post("/import")


export default router