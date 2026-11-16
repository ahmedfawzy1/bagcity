import mongoose from "mongoose";

let connectionPromise = null;

const connectDB = () => {
  if (connectionPromise) {
    return connectionPromise;
  }

  connectionPromise = mongoose
    .connect(process.env.DATABASE_URL, {
      serverSelectionTimeoutMS: 5000,
    })
    .catch((error) => {
      connectionPromise = null;
      throw error;
    });

  return connectionPromise;
};

export default connectDB;
