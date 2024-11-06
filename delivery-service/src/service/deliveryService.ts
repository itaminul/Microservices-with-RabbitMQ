import { NextFunction, Request, Response } from "express";
import { AppDataSource } from "../data-source";

import successResponse from "../middlewares/successResponse";
import { DeliveryProducer } from "../rabbitMQ/deliveryProducer";
import { Delivery } from "../entity/Delivery";
export class DeliveryService {
  private deliveryProducer: DeliveryProducer;

  constructor() {
    this.deliveryProducer = new DeliveryProducer();
    this.initialize();
  }

  private async initialize() {
    await this.deliveryProducer.initialize();
  }

  async createDelivery(deliveryId: number, status: string) {
    const orderRepository = AppDataSource.getRepository(Delivery);
    const order = new Delivery();
    order.usersId = deliveryId;
    order.orderId = 11;
    (order.product = "dasfa"),
      (order.quantity = 1),
      (order.deliveryStatus = false);
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
      order.deliveryStatus = false;
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

  async processOrder(deliveryId: number, status: string): Promise<void> {
    await this.createDelivery(deliveryId, status);
  }
}
