import express from 'express'

import { USET_ROLE } from '../facility/facility.constant'
import auth from '../../middlewares/auth'
import validateRequest from '../../middlewares/validateRequest'
import { BookingValidation } from './bookings.validation'
import { BookingControllers } from './bookings.controller'

const router = express.Router()

router.post(
  '/bookings',
  auth(USET_ROLE.user),
  validateRequest(BookingValidation.createBookingValidationSchema),
  BookingControllers.createBooking
)

router.get('/bookings', auth(USET_ROLE.admin), BookingControllers.getAllBooking)

router.get(
  '/bookings/user',
  auth(USET_ROLE.user),
  BookingControllers.getSingleBooking
)

router.get('/check-availability', BookingControllers.getAvailabilBooking)

router.delete(
  '/bookings/:id',
  auth(USET_ROLE.user),
  BookingControllers.deleteBooking
)

export const BookingRoutes = router
