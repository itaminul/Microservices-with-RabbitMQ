import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Order } from "../entity/Order";
import { sendOrderMessage } from "../rabbitMQ/rabbitmqService";

export class OrderController {
  async createOrder(req: Request, res: Response) {
    const orderRepository = AppDataSource.getRepository(Order);

    // Create orders from the request body
    const orders = Array.isArray(req.body) ? req.body : [req.body];
    const savedOrders = await orderRepository.save(orders);

    // Send each saved order to RabbitMQ
    savedOrders.forEach((order) => sendOrderMessage(order));

    // Respond with the saved orders
    res.status(201).send(savedOrders); // Use 201 for created
  }
}
