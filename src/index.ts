import mongoose from 'mongoose';
import authRouter from './routes/auth';
import chatRouter from './routes/chat';
import adminRouter from './routes/admin';
import studentRouter from './routes/student';

import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();


const app = express();
// Enable CORS for frontend origin
app.use(cors({
  origin: ["http://localhost:5173", "https://tpc-chatbot-lpu.vercel.app"],
  credentials: true
}));
app.use(express.json());
// Mount authentication routes
app.use('/api/auth', authRouter);
app.use('/api/chat', chatRouter);
app.use('/api/student', studentRouter);
app.use('/api/admin', adminRouter);
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
