"use server";
import mongoose from 'mongoose';

declare global {
  var mongoose: {
    promise: Promise<mongoose.Mongoose> | null;
    conn: mongoose.Connection | null;
  };
}

if (!global.mongoose) {
  global.mongoose = { conn: null, promise: null };
}

export const connectToDatabase = async () => {
  if (global.mongoose.conn) {
    return global.mongoose.conn;
  }

  if (!process.env.MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable');
  }

  const options = {
    bufferCommands: true,
  };

  global.mongoose.promise = mongoose.connect(process.env.MONGODB_URI!, options);
  const mongooseInstance = await global.mongoose.promise;
  global.mongoose.conn = mongooseInstance.connection;

  return global.mongoose.conn;
};
// await connectToDatabase();
