/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status'
import { TBooking } from './bookings.interface'
import { Booking } from './bookings.model'
import AppError from '../../errors/AppError'
import { Facility } from '../facility/facility.model'

const createBookingIntoDB = async (payload: TBooking, userId: string) => {
  const { date, startTime, endTime, facility } = payload

  //get the all schedules of the faculties
  const assignedSchedules = await Booking.find({
    facility,
    date: { $in: date },
  }).select('date startTime endTime isBooked')

  // if any schedule booked canceled, then it's not count
  const assignedValidSchedules = assignedSchedules.filter(
    (schedule) => schedule.isBooked !== 'canceled'
  )

  const newSchedule = {
    date,
    startTime,
    endTime,
  }

  // if facility is already booked then throw error
  assignedValidSchedules.forEach((schedule) => {
    const existingStartTime: any = new Date(
      `1970-01-10T${schedule.startTime}:00`
    )
    const existingEndTime: any = new Date(`1970-01-10T${schedule.endTime}:00`)
    const newStartTime: any = new Date(`1970-01-10T${newSchedule.startTime}:00`)
    const newEndTime: any = new Date(`1970-01-10T${newSchedule.endTime}:00`)

    if (newStartTime < existingEndTime && newEndTime > existingStartTime) {
      throw new AppError(
        httpStatus.CONFLICT,
        `This Facility is not available at that time! Choose other time or day`
      )
    }
  })

  // find the facility
  const facilityData = await Facility.findById(facility)
  if (!facilityData) {
    throw new AppError(httpStatus.NOT_FOUND, `This Facility is not found!`)
  }

  // if facility is deleted, then throw error
  const isValidFacilityData = Object.values(facilityData).find(
    (facility) => facility?.isDeleted === true
  )
  if (isValidFacilityData) {
    throw new AppError(httpStatus.NOT_FOUND, `This Facility is Deleted!`)
  }

  // calculte booking payable amount depends on facility pricePerHour
  const pricePerHour = facilityData?.pricePerHour
  const start: any = new Date(`1970-01-10T${newSchedule.startTime}:00`)
  const end: any = new Date(`1970-01-10T${newSchedule.endTime}:00`)
  const differenceInMilliseconds = end - start
  const differenceInHours = differenceInMilliseconds / 3600000

  const payableAmount = Number(pricePerHour) * differenceInHours

  const result = await Booking.create({
    ...payload,
    user: userId,
    payableAmount,
  })
  return result
}

const getAllFacilityFromDB = async () => {
  const result = await Booking.find().populate('facility').populate('user')
  return result
}

const getAvailabilFacilityFromDB = async (queryDate: any) => {
  const date2 = queryDate.date
  const today = new Date()
  const formattedDate = today.toISOString().split('T')[0]
  const startDate = date2 ? date2 : formattedDate

  // Retrieve bookings for the specified date
  const bookings = await Booking.find({
    date: startDate,
    facility: queryDate?.facility,
  }).select('date startTime endTime isBooked')

  interface TimeSlot {
    startTime: string
    endTime: string
  }

  // create 24 hours time slots (1h).
  const generateAllDayTimeSlots = (): TimeSlot[] => {
    const slots: TimeSlot[] = []
    for (let hour = 0; hour < 24; hour++) {
      const startTime = `${hour.toString().padStart(2, '0')}:00`
      const endTime = `${(hour + 1).toString().padStart(2, '0')}:00`
      slots.push({ startTime, endTime })
    }
    return slots
  }

  const availableTimeSlots = generateAllDayTimeSlots()

  // all bookd time slots of search date
  const filterBookedTimeSlots = (timeSlots: any[], bookings: any[]) => {
    const bookedSlots = bookings.map((booking) => ({
      startTime: new Date(`1970-01-10T${booking.startTime}:00`),
      endTime: new Date(`1970-01-10T${booking.endTime}:00`),
    }))

    return timeSlots.filter((slot) => {
      return !bookedSlots.some((bookedSlot) => {
        const slotStartTime = new Date(`1970-01-10T${slot.startTime}:00`)
        const slotEndTime = new Date(`1970-01-10T${slot.endTime}:00`)

        return (
          slotStartTime < bookedSlot.endTime &&
          slotEndTime > bookedSlot.startTime
        )
      })
    })
  }

  // available time slots
  const availableSlots = filterBookedTimeSlots(availableTimeSlots, bookings)

  return availableSlots
}

const getSingleFacilityFromDB = async (userId: string) => {
  const result = await Booking.find({ user: userId }).populate('facility')
  return result
}

const deleteFacilityFromDB = async (id: string, userId: string) => {
  const userData = await Booking.findOne({ _id: id })
  const objectId = userData?.user
  const stringId = objectId?.toString()
  if (userId !== stringId) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'This is not your booking!')
  }
  const result = await Booking.findByIdAndUpdate(
    id,
    { isBooked: 'canceled' },
    { new: true }
  )
  return result
}
export const BookingService = {
  createBookingIntoDB,
  getAllFacilityFromDB,
  getSingleFacilityFromDB,
  getAvailabilFacilityFromDB,
  deleteFacilityFromDB,
}
