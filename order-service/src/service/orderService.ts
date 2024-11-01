import { NextFunction, Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Order } from "../entity/Order";
import successResponse from "../middlewares/successResponse";
import { sendOrderMessage } from "../rabbitMQ/rabbitmqService";

export class OrderService {
  async createOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const orderRepository = AppDataSource.getRepository(Order);
      const orders = Array.isArray(req.body) ? req.body : [req.body];
      const savedOrders = await orderRepository.save(orders);
      // await Promise.all(savedOrders.forEach((order) => sendOrderMessage(order)));
      await Promise.all(savedOrders.map((order) => sendOrderMessage(order)));
      successResponse(res, savedOrders);
    } catch (error) {
      next(error);
    }
  }

  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const orderRepository = AppDataSource.getRepository(Order);
      const results = await orderRepository.find();
      successResponse(res, results);
    } catch (error) {
      next(error);
    }
  }
}
