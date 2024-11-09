import { NextFunction, Request, Response } from "express";
import { AppDataSource } from "../data-source";

import successResponse from "../middlewares/successResponse";
import { DeliveryProducer } from "../rabbitMQ/deliveryProducer";
import { Delivery } from "../entity/Delivery";
import { DeliveryConsumer } from "../rabbitMQ/deliveryConsumer";
export class DeliveryService {
  private deliveryProducer: DeliveryProducer;
  private deliveryConsume: DeliveryConsumer;

  constructor() {
    this.deliveryProducer = new DeliveryProducer();
    this.deliveryConsume = new DeliveryConsumer(this);
    this.initialize();
  }

  private async initialize() {
    await this.deliveryProducer.initialize();
    await this.deliveryConsume.initialize();
  }

  async createDelivery(usersId: number, deliveryStatus: string) {
    const orderRepository = AppDataSource.getRepository(Delivery);
    const order = new Delivery();
    order.usersId = usersId;
    order.orderId = 33;
    (order.product = "dasfa"),
      (order.quantity = 1),
      (order.status = deliveryStatus);
    //start a transaction
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      await orderRepository.save(order);
      await queryRunner.commitTransaction();

      await this.deliveryProducer.sendDeliveryStatus(order);
      // successResponse(res, sendOrder);
    } catch (error) {
      console.error(`Failed to send order ${order.id} to queue:`, error);
      order.status = "CREATION_FAILED";
      await queryRunner.rollbackTransaction();
      return await orderRepository.save(order);
      // successResponse(res, savedOrder);
    } finally {
      await queryRunner.release();
    }
  }
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const orderRepository = AppDataSource.getRepository(Delivery);
      const results = await orderRepository.find();
      successResponse(res, results);
    } catch (error) {
      next(error);
    }
  }

  async processOrder(usersId: number, status: string): Promise<void> {
    await this.createDelivery(usersId, status);
  }

  async closeMessaging(): Promise<void> {
    await this.deliveryProducer.close();
    await this.deliveryConsume.close();
  }
}
