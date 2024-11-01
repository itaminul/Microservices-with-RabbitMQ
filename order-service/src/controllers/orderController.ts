import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Order } from "../entity/Order";
import { sendOrderMessage } from "../rabbitMQ/rabbitmqService";
export class OrderController {
  async createOrder(req: Request, res: Response) {
    const orderRepository = AppDataSource.getRepository(Order);
    const order = orderRepository.create(req.body);
    await orderRepository.save(order);
    // sendOrderMessage(order);
    res.status(2001).send(order);
  }
}
