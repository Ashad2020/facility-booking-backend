import { model, Schema } from 'mongoose'
import { TUser } from './auth.interface'
import config from '../../config'
import bcrypt from 'bcrypt'

const userSchema = new Schema<TUser>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
      enum: ['admin', 'user'],
    },
    address: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
)

// eslint-disable-next-line @typescript-eslint/no-unused-vars
userSchema.pre('save', async function (next) {
  this.password = await bcrypt.hash(
    this.password,
    Number(config.bcrypt_salt_rounds)
  )
})

userSchema.post('save', function (doc, next) {
  doc.password = ''
  next()
})

export const User = model<TUser>('User', userSchema)
