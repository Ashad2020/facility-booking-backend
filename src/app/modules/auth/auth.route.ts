import express from 'express'
import { AuthValidation } from './auth.validation'
import { AuthControllers } from './auth.controller'
import validateRequest from '../../middlewares/validateRequest'

const router = express.Router()

router.post(
  '/signup',
  validateRequest(AuthValidation.signInValidationSchema),
  AuthControllers.signUpUser
)

router.post(
  '/login',
  validateRequest(AuthValidation.loginValidationSchema),
  AuthControllers.loginUser
)

export const AuthRoutes = router
