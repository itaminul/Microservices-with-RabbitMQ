import { NextFunction, Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Order } from "../entity/Order";
import successResponse from "../middlewares/successResponse";
import { OrderProducer } from "../rabbitMQ/orderProducer";
import { OrderConsumer } from "../rabbitMQ/orderConsumer";

export class OrderService {
  private orderProducer: OrderProducer;
  private orderConsumer: OrderConsumer;

  constructor() {
    this.orderProducer = new OrderProducer();
    this.orderConsumer = new OrderConsumer(this);
    this.initialize();
  }

  private async initialize() {
    await this.orderProducer.initialize();
    await this.orderConsumer.initialize();
  }

  async createOrder(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Order> {
    const orderRepository = AppDataSource.getRepository(Order);
    const order = new Order();
    order.usersId = req.body.usersId;
    order.product = req.body.product;
    order.quantity = req.body.quantity;
    order.status = "PENDING";

    await orderRepository.save(order);

    try {
      const sendOrder = await this.orderProducer.sendOrder(order);
      // successResponse(res, sendOrder);
    } catch (error) {
      console.error(`Failed to send order ${order.id} to queue:`, error);
      order.status = "QUEUE_FAILED";
      const savedOrder = await orderRepository.save(order);
      // successResponse(res, savedOrder);
    }

    return order;
  }

  async getOrder(id: number) {
    const orderRepository = AppDataSource.getRepository(Order);
    await orderRepository.findOne({
      where: {
        id: id,
      },
    });
  }

  async updateOrderStatus(orderId: number, status: string): Promise<void> {
    const orderRepository = AppDataSource.getRepository(Order);
    await orderRepository.update(orderId, { status });
    console.log(`Order ${orderId} status updated to ${status}`);
  }

  async closeMessaging(): Promise<void> {
    await this.orderProducer.close();
    await this.orderConsumer.close();
  }
}

export default function Component() {
  return null;
}
/*
export class OrderService {

  constructor() {
    this.orderProducer = new OrderProducer();
    this.orderConsumer = new OrderConsumer(this);
    this.initialize();
  }

  private async initialize() {
    await this.orderProducer.initialize();
    await this.orderConsumer.initialize();
  }

  updateOrderStatus(orderId: any, status: any) {
      throw new Error("Method not implemented.");
  }
  async createOrder(req: Request, res: Response, next: NextFunction) {
    const orders = Array.isArray(req.body) ? req.body : [req.body];
    //start a transaction
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const savedOrders = await queryRunner.manager.save(Order, orders);
      await Promise.all(savedOrders.map((order) => OrderProducer(order)));
      // Commit the transaction
      await queryRunner.commitTransaction();
      successResponse(res, savedOrders);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      next(error);
    } finally {
      await queryRunner.release();
    }
  }
  /*
  async createOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const orderRepository = AppDataSource.getRepository(Order);
      const orders = Array.isArray(req.body) ? req.body : [req.body];
      const savedOrders = await orderRepository.save(orders);
      // await Promise.all(savedOrders.forEach((order) => sendOrderMessage(order)));
      await Promise.all(savedOrders.map((order) => OrderProducer(order)));
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

*/
