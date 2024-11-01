import express from 'express'
import { createConnection } from 'typeorm'
import authRoutes from './routes/authRoutes'
import { connectRabbitMQ } from './config/rabbitmq'

const app = express()

app.use(express.json())
app.use('/auth', authRoutes)

const initializeApp = async () => {
  try {
    await createConnection({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      entities: [__dirname + '/entity/*.ts'],
      synchronize: true,
    })
    console.log('Connected to the database')

    await connectRabbitMQ()

    const port = process.env.PORT || 3000
    app.listen(port, () => {
      console.log(`Auth service listening on port ${port}`)
    })
  } catch (error) {
    console.error('Error initializing app:', error)
  }
}

initializeApp()

export default app