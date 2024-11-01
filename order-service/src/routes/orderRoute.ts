import { Router } from "express";
import { OrderController } from "../controllers/orderController";
const orderController = new OrderController();
const router = Router();
router.post("/createOrder", orderController.createOrder);
router.get("/getOrder", orderController.getAll);
export default router;
