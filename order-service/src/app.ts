import express from 'express';
import { AppDataSource } from './data-source';

const app = express();
const port = 5000;
 AppDataSource.initialize();
console.log("Data Source has been initialized!");


app.get('/', (req, res) => {
  res.send('Hello, TypeScript Node Express!');
});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});