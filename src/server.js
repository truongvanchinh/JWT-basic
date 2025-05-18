import express from 'express';
import 'dotenv/config';
import initAPI from './routes/api.js';

const app = express();

const PORT = process.env.PORT || 8018;

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

initAPI(app);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});