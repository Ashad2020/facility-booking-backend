/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status'

import { JwtPayload } from 'jsonwebtoken'
import catchAsync from '../../utils/catchAsync'
import { BookingService } from './bookings.service'
import sendResponse from '../../utils/sendResponse'

const createBooking = catchAsync(async (req: JwtPayload, res) => {
  const userId = req?.user?.userId
  const result = await BookingService.createBookingIntoDB(req.body, userId)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Booking created successfully',
    data: result,
  })
})

const getAllBooking = catchAsync(async (req, res) => {
  const result = await BookingService.getAllFacilityFromDB()
  if (!result.length) {
    sendResponse(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: 'No Data Found',
      data: result,
    })
  }
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Bookings retrieved successfully',
    data: result,
  })
})

const getAvailabilBooking = catchAsync(async (req: any, res) => {
  const result = await BookingService.getAvailabilFacilityFromDB(req.query)
  if (!result.length) {
    sendResponse(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: 'No Data Found',
      data: result,
    })
  }
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Availability checked successfully',
    data: result,
  })
})

const getSingleBooking = catchAsync(async (req: JwtPayload, res) => {
  const result = await BookingService.getSingleFacilityFromDB(req?.user?.userId)
  if (!result.length) {
    sendResponse(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: 'No Data Found',
      data: result,
    })
  }

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Bookings retrieved successfully',
    data: result,
  })
})

const deleteBooking = catchAsync(async (req: JwtPayload, res) => {
  const userId = req?.user?.userId
  const { id } = req.params
  const result = await BookingService.deleteFacilityFromDB(id, userId)
  if (!result) {
    sendResponse(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: 'No Data Found',
      data: result,
    })
  }

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Booking cancelled successfully',
    data: result,
  })
})

export const BookingControllers = {
  createBooking,
  getAllBooking,
  getSingleBooking,
  getAvailabilBooking,
  deleteBooking,
}
