import amqp, { Connection, Channel } from "amqplib";
import { Order } from "../entity/Order";

export class OrderProducer {
  private connection: Connection | null = null;
  private channel: Channel | null = null;
  private readonly queue = "order_queue";

  async initialize(): Promise<void> {
    try {
      this.connection = await amqp.connect("amqp://localhost");
      this.channel = await this.connection.createChannel();
      await this.channel.assertQueue(this.queue, { durable: true });
    } catch (error) {
      console.error("Failed to initialize OrderProducer:", error);
      throw error;
    }
  }

  async sendOrder(order: Order): Promise<void> {
    if (!this.channel) {
      throw new Error("OrderProducer is not initialized");
    }

    try {
      this.channel.sendToQueue(this.queue, Buffer.from(JSON.stringify(order)), {
        persistent: true,
      });
      console.log(`Order ${order.id} sent to queue`);
    } catch (error) {
      console.error(`Failed to send order ${order.id}:`, error);
      throw error;
    }
  }

  async close(): Promise<void> {
    try {
      if (this.channel) {
        await this.channel.close();
      }
      if (this.connection) {
        await this.connection.close();
      }
    } catch (error) {
      console.error("Error closing OrderProducer:", error);
      throw error;
    }
  }
}

export default function Component() {
  return null;
}