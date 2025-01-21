import cors from 'cors'
import express, { Application, Request, Response } from 'express'
import router from './app/routes'
import { globalErrorHandler } from './app/middlewares/globalErrorHandler'
import { notFound } from './app/middlewares/notfound'

const app: Application = express()

//parsers
app.use(express.json())
app.use(cors())

//application route
app.use('/api', router)
// Route handler for the root path
app.get('/test', (req: Request, res: Response) => {
  res.send('Hello World!')
})

app.use(notFound)
app.use(globalErrorHandler)

//not Found
export default app
