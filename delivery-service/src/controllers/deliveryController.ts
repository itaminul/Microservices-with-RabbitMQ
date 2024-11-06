import { NextFunction, Request, Response } from "express";
import { DeliveryService } from "../service/deliveryService";
const deliveryService = new DeliveryService();
export class DeliveryController {
  async createDelivery(req: Request, res: Response, next: NextFunction) {
    const deliveryId = 1;
    const statusCheck = "true";
    try {
      const deliver = await deliveryService.createDelivery(
        deliveryId,
        statusCheck
      );

      res.status(201).json(deliver);
    } catch (error) {
      res.status(500).json({ message: "Error creating order" });
    }
  }

  async getAll(req: Request, res: Response, next: NextFunction) {
    return await deliveryService.getAll(req, res, next);
  }
}
