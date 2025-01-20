import cors from 'cors'
import express, { Application, Request, Response } from 'express'
const app: Application = express()

//parsers
app.use(express.json())
app.use(cors())

// Route handler for the root path
app.get('/test', (req: Request, res: Response) => {
  res.send('Hello World!')
})
export default app
