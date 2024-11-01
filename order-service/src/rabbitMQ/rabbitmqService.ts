import amqp from "amqplib";
import { Order } from "../entity/Order";
const queue = "orders";
export const sendOrderMessage = async (order: Order) => {
  const connection = await amqp.connect("amqp://localhost");
  const channel = await connection.createChannel();
  await channel.assertQueue(queue);
  channel.sendToQueue(queue, Buffer.from(JSON.stringify(order)));
  setTimeout(() => {
    connection.close();
  }, 5000);
};
