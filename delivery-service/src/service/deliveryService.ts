import { NextFunction, Request, Response } from "express";
import { AppDataSource } from "../data-source";

import successResponse from "../middlewares/successResponse";
import { DeliveryProducer } from "../events/deliveryProducer";
import { Delivery } from "../entity/Delivery";
import { DeliveryConsumer } from "../events/deliveryConsumer";
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

  async createDelivery(usersId: number, orderId: number, deliveryStatus: string) {
    const deliveryRepository = AppDataSource.getRepository(Delivery);

    /*
      const orderUrl = `http://localhost:3000/api/order/getOrderById/${orderId}`;
    const response = await axios.get(orderUrl);
    const orderData = response.data;
    console.log("orderData", orderData)
    const order = new Delivery();
    order.usersId = orderData.usersId;
    order.orderId = orderData.id;
    order.product = orderData.product,
    order.quantity = orderData.quantity,
    order.status = deliveryStatus;
    */
    const deliver = new Delivery();
    deliver.usersId = usersId;
    deliver.orderId = orderId;
    (deliver.product = "dasfa"),
      (deliver.quantity = 1),
      (deliver.status = deliveryStatus);
    //start a transaction
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      await deliveryRepository.save(deliver);
      await queryRunner.commitTransaction();

      await this.deliveryProducer.sendDeliveryStatus(deliver);
      // successResponse(res, sendOrder);
    } catch (error) {
      console.error(`Failed to send order ${deliver.id} to queue:`, error);
      deliver.status = "CREATION_FAILED";
      await queryRunner.rollbackTransaction();
      return await deliveryRepository.save(deliver);
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

  async processOrder(usersId: number, orderId: number, status: string): Promise<void> {
    await this.createDelivery(usersId, orderId,status);
  }

  async closeMessaging(): Promise<void> {
    await this.deliveryProducer.close();
    await this.deliveryConsume.close();
  }
}
