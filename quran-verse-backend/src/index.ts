import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import verseRoutes from './routes/verses';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI as string)
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('MongoDB connection error:', error));

app.use('/api/verses', verseRoutes);

app.get('/', (req, res) => {
  res.send('Quran Verse API is running');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});