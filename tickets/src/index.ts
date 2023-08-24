import mongoose from 'mongoose';
import { app } from './app';

const PORT = process.env.PORT || 4002;

const start = async () => {
  process.env = {
    JWT_KEY: 'jdjasjdjadasd',
    MONGO_URI: 'mongodb://127.0.0.1:27017/tickets',
  };
  // if (!process.env.JWT_KEY) {
  //   throw new Error('JWT_KEY must be defined');
  // }
  // if (!process.env.MONGO_URI) {
  //   throw new Error('MONGO_URI mus be defined');
  // }

  try {
    await mongoose.connect(process.env.MONGO_URI!);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.log(error);
  }

  app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
  });
};

start();