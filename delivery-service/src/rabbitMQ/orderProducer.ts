import amqp from "amqplib";
import { Delivery } from "../entity/Delivery";


export const OrderProducer = async(order: Delivery) =>  {

  try {
    const connection = await amqp.connect("amqp://localhost");
    if (!connection) {
      throw new Error("RabbitMQ connection is not established");
    }
    const channel = await connection.createChannel();
    const queue = "order_queue";
    await channel.assertQueue(queue, { durable: true });
    channel.sendToQueue(queue, Buffer.from(JSON.stringify(order)), {
      persistent: true,
    });
    await channel.close();
  } catch (error) {
     console.error("Failed to send order:", error);
  }
}


/*

import amqp from "amqplib";
import { Order } from "../entity/Order";
export const sendOrderMessage = async (order: Order) => {
  try {
    const connection = await amqp.connect("amqp://localhost");
    if (!connection) {
      throw new Error("RabbitMQ connection is not established");
    }
    const channel = await connection.createChannel();
    const queue = "order_queue";
    await channel.assertQueue(queue, { durable: true });
    channel.sendToQueue(queue, Buffer.from(JSON.stringify(order)), {
      persistent: true,
    });
    await channel.close();
  } catch (error) {
    console.error("Error sending message to RabbitMQ:", error);
  }
};
*/