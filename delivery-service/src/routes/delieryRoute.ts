import { Router } from "express";
import { DeliveryController } from "../controllers/deliveryController";

const deliveryController = new DeliveryController()
const router = Router();
router.post("/createDeliery", deliveryController.createDelivery);
router.get("/getDelivery", deliveryController.getAll);
export default router;
