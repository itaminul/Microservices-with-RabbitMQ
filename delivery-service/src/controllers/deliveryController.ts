import { NextFunction, Request, Response } from "express";
import { DeliveryService } from "../service/deliveryService";
const deliveryService = new DeliveryService();
export class DeliveryController {
  async createDelivery(req: Request, res: Response) {
    const { usersId, status, orderId } = req.body;
    try {
      const deliver = await deliveryService.createDelivery(
        usersId,
        orderId,
        status
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
