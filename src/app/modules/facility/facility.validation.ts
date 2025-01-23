import { z } from 'zod'

const createFacilityValidationSchema = z.object({
  body: z.object({
    name: z.string(),
    description: z.string().optional(),
    pricePerHour: z.number().nonnegative(),
    location: z.string(),
    image: z.string().optional(),
    isDeleted: z.boolean().optional(),
  }),
})

const updateFacilityValidationSchema = z.object({
  body: z
    .object({
      name: z.string().optional(),
      description: z.string().optional(),
      pricePerHour: z.number().nonnegative().optional(),
      location: z.string().optional(),
      image: z.string().optional(),
      isDeleted: z.boolean().optional(),
    })
    .optional(),
})

export const FacilityValidation = {
  createFacilityValidationSchema,
  updateFacilityValidationSchema,
}
