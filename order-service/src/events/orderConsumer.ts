import amqp, { Connection, Channel } from "amqplib";
import { OrderService } from "../service/orderService";

export class OrderConsumer {
  private connection: Connection | null = null;
  private channel: Channel | null = null;
  private readonly queue = "delivery_status_queue";
  private orderService: OrderService;

  constructor(orderService: OrderService) {
    this.orderService = orderService;
  }

  async initialize(): Promise<void> {
    try {
      this.connection = await amqp.connect("amqp://localhost");
      this.channel = await this.connection.createChannel();
      await this.channel.assertQueue(this.queue, { durable: true });
      this.consume();
    } catch (error) {
      console.error("Failed to initialize OrderConsumer:", error);
      throw error;
    }
  }

  private async consume(): Promise<void> {
    if (!this.channel) {
      throw new Error("OrderConsumer is not initialized");
    }

    this.channel.consume(this.queue, async (msg) => {
      if (msg) {
        try {
          const content = JSON.parse(msg.content.toString());
          console.log("content", content);
          const orderId = content.orderId; // Extract orderId
          if (!orderId) {
            console.error("Order ID is missing in the message.");
            //   this.channel.nack(msg); // Reject the message if orderId is missing
            return;
          }
          await this.orderService.updateOrderStatus(
            content.orderId,
            content.status
          );
          this.channel?.ack(msg);
        } catch (error) {
          console.error("Error processing message:", error);
          this.channel?.nack(msg);
        }
      }
    });
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
      console.error("Error closing OrderConsumer:", error);
      throw error;
    }
  }
}

export default function Component() {
  return null;
}
