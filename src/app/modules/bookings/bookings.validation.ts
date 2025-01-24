import { z } from 'zod'

const createBookingValidationSchema = z.object({
  body: z
    .object({
      date: z
        .string()
        .regex(
          /^\d{4}-\d{2}-\d{2}$/,
          'Invalid date format, should be YYYY-MM-DD'
        ),
      startTime: z
        .string()
        .regex(/^\d{2}:\d{2}$/, 'Invalid time format, should be HH:MM'),
      endTime: z
        .string()
        .regex(/^\d{2}:\d{2}$/, 'Invalid time format, should be HH:MM'),
      user: z.string().optional(),
      facility: z.string(),
      payableAmount: z.number().nonnegative().optional(),
      isBooked: z.enum(['confirmed', 'unconfirmed', 'canceled']).optional(),
    })
    .refine(
      (body) => {
        const start: any = new Date(`1970-01-10T${body.startTime}:00`)
        const end: any = new Date(`1970-01-10T${body.endTime}:00`)
        return end > start
      },
      {
        message: 'Start time should be before End time !',
      }
    ),
})

export const BookingValidation = {
  createBookingValidationSchema,
}
