import { AppDataSource } from "../data-source";
import { Delivery } from "../entity/Delivery";

export class CustomerDelivery {
  async createOrderDeliveryToCustomer(
    usersId: number,
    orderId: number,
    customerDeliveryStatus: string
  ) {
    const orderDeliverToCustomer = AppDataSource.getRepository(Delivery);
    const orderDelivery = new Delivery();
    orderDelivery.usersId = usersId;
    orderDelivery.orderId = orderId;
    orderDelivery.customerDeliveryStatus = customerDeliveryStatus;
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const data = orderDeliverToCustomer.save(orderDelivery);
    } catch (error) {
      console.error(
        `Failed to send order ${orderDelivery.usersId} to queue:`,
        error
      );
      orderDelivery.customerDeliveryStatus = "CREATION_FAILED";
      await queryRunner.rollbackTransaction();
      return await orderDeliverToCustomer.save(orderDelivery);
    } finally {
      await queryRunner.release();
    }
  }
}
