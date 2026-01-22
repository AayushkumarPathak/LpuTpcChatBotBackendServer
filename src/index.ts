import mongoose from 'mongoose';
import authRouter from './routes/auth';
import chatRouter from './routes/chat';

import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();


const app = express();
// Enable CORS for frontend origin
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
// Mount authentication routes
app.use('/api/auth', authRouter);
app.use('/api/chat', chatRouter);
const port = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI!)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });


app.get('/', (req, res) => {
  res.send('Hello World!');
});
