import express from 'express';
import bodyParser from 'body-parser';
import indexRoutes from './routes/indexRoutes.js'
const app = express();
const port = 3003;
app.use(bodyParser.json());
app.get('/', async (req, res) => {
  try {
    const users = await db.select('*').from('users');
    res.json(users);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).send('Internal Server Error');
  }
});

app.use('/api', indexRoutes)
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
