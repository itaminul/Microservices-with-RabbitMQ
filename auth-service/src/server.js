import app from './app'

const port = process.env.PORT || 3000

app.listen(port, () => {
  console.log(`Auth service listening on port ${port}`)
})