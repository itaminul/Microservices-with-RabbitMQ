import { Response } from "express";

const successResponse = (
  res: Response,
  data: any,
  statusCode: number = 200
): void => {
  res.status(statusCode).json({
    success: true,
    statusCode,
    message: "Request was successful.",
    data,
  });
};

export default successResponse;
