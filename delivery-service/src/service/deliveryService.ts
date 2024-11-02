import { NextFunction, Request, Response } from "express";
import { AppDataSource } from "../data-source";

import successResponse from "../middlewares/successResponse";
import { OrderProducer } from "../rabbitMQ/orderProducer";
import { Delivery } from "../entity/Delivery";
export class OrderService {
  async createOrder(req: Request, res: Response, next: NextFunction) {
    const orders = Array.isArray(req.body) ? req.body : [req.body];
    //start a transaction
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const savedOrders = await queryRunner.manager.save(Delivery, orders);
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
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const orderRepository = AppDataSource.getRepository(Delivery);
      const results = await orderRepository.find();
      successResponse(res, results);
    } catch (error) {
      next(error);
    }
  }
}
