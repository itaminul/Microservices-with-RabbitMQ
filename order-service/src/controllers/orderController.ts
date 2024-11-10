import { Request, Response, NextFunction } from "express";
import { OrderService } from "../service/orderService";

export class OrderController {
  private orderService: OrderService;

  constructor(orderService: OrderService) {
    this.orderService = orderService;
  }

  createOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const order = await this.orderService.createOrder(req, res, next);
      res.status(201).json(order);
    } catch (error) {
      res.status(500).json({ message: "Error creating order" });
    }
  };

  getOrderById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const order = await this.orderService.getOrderById(req);
      res.status(201).json(order);
    } catch (error) {
      next(error);
    }
    // res.status(201).json(orderId);
  };
}

export default function Component() {
  return null;
}
/*
const orderService = new OrderService();
export class OrderController {
  async createOrder(req: Request, res: Response, next: NextFunction) {
    return await orderService.createOrder(req, res, next);
  }

  async getAll(req: Request, res: Response, next: NextFunction) {
    return await orderService.getAll(req, res, next);
  }
}
*/
