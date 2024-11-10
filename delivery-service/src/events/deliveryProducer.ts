import amqp, { Channel, Connection } from "amqplib";
import { Delivery } from "../entity/Delivery";

export class DeliveryProducer {
  private connection: Connection | null = null;
  private channel: Channel | null = null;
  private readonly queue = "delivery_status_queue";

  async initialize(): Promise<void> {
    try {
      this.connection = await amqp.connect("amqp://localhost");
      this.channel = await this.connection.createChannel();
      await this.channel.assertQueue(this.queue, { durable: true });
      console.log("Delivery Producer initialized successfully");
    } catch (error) {
      throw error;
    }
  }

  async sendDeliveryStatus(delivery: Delivery): Promise<void> {
    if (!this.channel) {
      throw new Error("Delivery producer is not initialized");
    }

    try {
      this.channel.sendToQueue(
        this.queue,
        Buffer.from(JSON.stringify(delivery)),
        {
          persistent: true,
        }
      );
      console.log(`Delivery ${delivery.id} status sent to queue`);
    } catch (error) {
      console.log(`Failed to send delivery ${delivery.id} status: `, error);
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
      console.log("DeliveryProducer closed successfully");
    } catch (error) {
      console.error("Error closing DeliveryProducer:", error);
      throw error;
    }
  }
}

export default function Component() {
  return null;
}
