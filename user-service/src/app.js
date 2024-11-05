import express from 'express'
const app = express()
import router from './routes/indexRoutes.js'
app.use('/api', router)
const port = process.env.PORT || 3003
app.listen(port, () => {
  console.log(`Users service listening on port ${port}`)
})

export default app