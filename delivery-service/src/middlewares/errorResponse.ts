import { Response } from "express";

const errorResponse = (
  res: Response,
  message: string,
  statusCode: number = 500
): void => {
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
};

export default errorResponse;
