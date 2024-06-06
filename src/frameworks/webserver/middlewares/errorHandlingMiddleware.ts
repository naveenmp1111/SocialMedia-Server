import AppError from "../../../utils/appError";
import { Request, Response, NextFunction } from 'express'


const errorHandlingMiddleware = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  err.statusCode = err.statusCode || 500
  err.status = err.status || 'Error';
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message
  })
}

export default errorHandlingMiddleware