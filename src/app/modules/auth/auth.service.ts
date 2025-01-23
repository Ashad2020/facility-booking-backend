import httpStatus from 'http-status'
import AppError from '../../errors/AppError'
import { TLoginUser, TUser } from './auth.interface'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import config from '../../config'
import { User } from './auth.model'

const signUpUserIntoDB = async (payload: TUser) => {
  const result = await User.create(payload)
  const { _id, name, email, role, phone, address } = result
  const finalResult = { _id, name, email, role, phone, address }
  return finalResult
}

const loginUser = async (payload: TLoginUser) => {
  //checking if ther user is exist
  const isUserExists = await User.findOne({ email: payload?.email })
  if (!isUserExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found !')
  }

  // checking if the password is correct
  const isPasswordMatched = await bcrypt.compare(
    payload?.password,
    isUserExists?.password
  )
  if (!isPasswordMatched) {
    throw new AppError(httpStatus.NOT_FOUND, 'Password is incorrect !')
  }

  // create token and sent to the client
  const jwtPayload = {
    email: isUserExists?.email,
    role: isUserExists?.role,
    userId: isUserExists?._id,
  }

  const accessTonen = jwt.sign(jwtPayload, config.jwt_access_secret as string, {
    expiresIn: '1d',
  })

  const { _id, name, email, role, phone, address } = isUserExists
  const userData = { _id, name, email, role, phone, address }

  return {
    token: accessTonen,
    data: userData,
  }
}

export const AuthServices = {
  signUpUserIntoDB,
  loginUser,
}
