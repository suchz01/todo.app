import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connect } from './db.js';
import routes from './routes/index.js';
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api', routes);

connect();

export default app;


