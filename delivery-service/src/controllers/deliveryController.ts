import { NextFunction, Request, Response } from "express";
import { OrderService } from "../service/deliveryService";
const orderService = new OrderService();
export class DeliveryController {
  async createDelivery(req: Request, res: Response, next: NextFunction) {
    return await orderService.createOrder(req, res, next);
  }

  async getAll(req: Request, res: Response, next: NextFunction) {
    return await orderService.getAll(req, res, next);
  }
}
