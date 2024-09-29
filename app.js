import express, { json } from 'express'
import { moviesRouter } from './routs/movies.js'
import { corsMiddleware } from './middlewares/cors.js'

const app = express()
app.disable('x-powered-by')
app.use(corsMiddleware())
app.use(json())
app.use('/movies', moviesRouter)

const PORT = process.env.PORT ?? 1234
app.listen(PORT, () => {
  console.log(`server listening on port https://localhost:${PORT}`)
})
