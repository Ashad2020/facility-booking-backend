import { JwtPayload } from 'jsonwebtoken'

// for get global jwt payload
declare global {
  namespace Express {
    interface Request {
      user: JwtPayload
    }
  }
}
