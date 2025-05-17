import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

// Load .env from backend folder (one level up from compiled file)
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export const connectDB = async (): Promise<void> => {
  try {
    const dburl = process.env.MONGODB_URI;
    console.log("DBURI : ", dburl);
    if (!dburl) throw new Error("MONGODB_URI is undefined");

    await mongoose.connect(dburl);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

export const disconnectDB = async (): Promise<void> => {
  try {
    await mongoose.disconnect();
    console.log('MongoDB disconnected');
  } catch (error) {
    console.error('MongoDB disconnection error:', error);
  }
};