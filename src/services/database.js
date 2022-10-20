import mongoose from 'mongoose';

import { debug } from '../app.js';

const connectDB = () => {
  mongoose.connection.on('error', (err) => {
    logError(err);
  });

  mongoose.connection.on('open', () => {
    debug('MONGODB CONNECTED !');
  });

  if (process.env.NODE_ENV === 'test') {
    return mongoose.connect(process.env.MONGO_TEST);
  }
  return mongoose.connect(process.env.MONGO);
};

export default connectDB;
