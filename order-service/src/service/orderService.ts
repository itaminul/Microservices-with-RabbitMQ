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

    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      await orderRepository.save(order);
      await queryRunner.commitTransaction();

      const sendOrder = await this.orderProducer.sendOrder(order);
      // successResponse(res, sendOrder);
    } catch (error) {
      console.error(`Failed to send order ${order.id} to queue:`, error);
      order.status = "QUEUE_FAILED";
      await queryRunner.rollbackTransaction();
      const savedOrder = await orderRepository.save(order);
      // successResponse(res, savedOrder);
    } finally {
      await queryRunner.release();
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

  async updateOrderStatus(id: number, status: string) {
    console.log('Updating order:', id); // Log values
    console.log('Updating status:', status); // Log values
    const orderRepository = AppDataSource.getRepository(Order);
    const updateResult = await orderRepository.update(id, { status });
  
    if (updateResult.affected === 0) {
      console.error(`Order ${id} not found or not updated.`);
    } else {
      console.log(`Order ${id} status updated to ${status}`);
    }
  }

  // async updateOrderStatus(id: number, orderStatus: string) {
  //   const orderRepository = AppDataSource.getRepository(Order);
  //   await orderRepository.update(id, { orderStatus: orderStatus });
  //   console.log(`Order ${id} status updated to ${orderStatus}`);
  // }

  async closeMessaging(): Promise<void> {
    await this.orderProducer.close();
    await this.orderConsumer.close();
  }
}

export default function Component() {
  return null;
}
