import { USET_ROLE } from './facility.constant'

export type TFacility = {
  name: string
  description: string
  pricePerHour: number
  location: string
  image: string
  isDeleted: boolean
}

export type TUserRole = keyof typeof USET_ROLE
