import { Router } from "express";
import { OrderController } from "../controllers/orderController";
import   { OrderService } from "../service/orderService";

let orderService: OrderService;

 orderService = new OrderService();
const orderController = new OrderController(orderService);
const router = Router();
router.post("/createOrder", orderController.createOrder);
router.get("/getOrderById/:id", orderController.getOrderById);
// router.get("/getOrder", orderController.getAll);
export default router;
