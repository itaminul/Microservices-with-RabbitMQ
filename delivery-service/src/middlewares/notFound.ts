import { Request, Response } from "express";
import errorResponse from "./errorResponse";

const notFound = (req: Request, res: Response): void => {
  errorResponse(
    res,
    `The requested URL ${req.originalUrl} was not found on this server.`,
    404
  );
};

export default notFound;
