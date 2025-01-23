import { ErrorRequestHandler } from 'express'
import { TErrorSources } from '../interface/error'
import config from '../config'
import { ZodError } from 'zod'
import handleZodError from '../errors/handleZodError'
import handleValidationError from '../errors/handleValidationError'
import handleCastError from '../errors/hanndleCastError'
import handleDuplicteError from '../errors/handleDuplicateError'
import AppError from '../errors/AppError'

export const globalErrorHandler: ErrorRequestHandler = (
  err,
  req,
  res,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next
) => {
  let statusCode = 500
  let message = 'something went wrong'

  let errorMessages: TErrorSources = [
    {
      path: '',
      message: 'Something went wrong',
    },
  ]
  // all kinds of global error handeler
  if (err instanceof ZodError) {
    const simplifiedError = handleZodError(err)
    statusCode = simplifiedError?.statusCode
    message = simplifiedError?.message
    errorMessages = simplifiedError?.errorMessages
  } else if (err?.name === 'ValidationError') {
    const simplifiedError = handleValidationError(err)
    statusCode = simplifiedError?.statusCode
    message = simplifiedError?.message
    errorMessages = simplifiedError?.errorMessages
  } else if (err?.name === 'CastError') {
    const simplifiedError = handleCastError(err)
    statusCode = simplifiedError?.statusCode
    message = simplifiedError?.message
    errorMessages = simplifiedError?.errorMessages
  } else if (err?.code === 11000) {
    const simplifiedError = handleDuplicteError(err)
    statusCode = simplifiedError?.statusCode
    message = err.errorResponse.errmsg
    errorMessages = simplifiedError?.errorMessages
  } else if (err instanceof AppError) {
    statusCode = err?.statusCode
    message = err?.message
    errorMessages = [
      {
        path: '',
        message: err?.message,
      },
    ]
  } else if (err instanceof Error) {
    message = err?.message
    errorMessages = [
      {
        path: '',
        message: err?.message,
      },
    ]
  }
  res.status(statusCode).json({
    success: false,
    message,
    errorMessages,
    stack: config.NODE_ENV === 'development' ? err?.stack : null,
  })
  return
}
