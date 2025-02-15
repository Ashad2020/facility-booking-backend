import { Response } from 'express'

type TRespons<T> = {
  statusCode: number
  success: boolean
  message?: string
  data?: T
  token?: string
}

const sendResponse = <T>(res: Response, data: TRespons<T>) => {
  res.status(data?.statusCode).json({
    success: data.success,
    statusCode: data.statusCode,
    message: data.message,
    token: data.token,
    data: data.data,
  })
}

export default sendResponse
