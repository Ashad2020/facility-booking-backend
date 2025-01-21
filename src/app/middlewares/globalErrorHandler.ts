import { NextFunction, Request, Response } from 'express'

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) => {
  const message = err.message || 'Something went wrong'
  const statusCode = err.statusCode || 500
  res.status(statusCode).json({ success: false, message, error: err })
}
