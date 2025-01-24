import mongoose, { Schema } from 'mongoose'
import { TBooking } from './bookings.interface'

const bookingSchema = new mongoose.Schema<TBooking>({
  facility: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Facility',
  },
  date: {
    type: String,
    required: true,
  },
  startTime: {
    type: String,
    required: true,
  },
  endTime: {
    type: String,
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  payableAmount: {
    type: Number,
    required: true,
  },
  isBooked: {
    type: String,
    enum: ['confirmed', 'unconfirmed', 'canceled'],
    default: 'confirmed',
  },
})

export const Booking = mongoose.model<TBooking>('Booking', bookingSchema)
