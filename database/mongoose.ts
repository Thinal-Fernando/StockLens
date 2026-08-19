import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

declare global {
  var mongooseCache: {
    connection: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  };
}

let cached = global.mongooseCache;

if (!cached) {
  cached = global.mongooseCache = { connection: null, promise: null };
}

export const connectionToDatabase = async () => {
  if (!MONGODB_URI) throw new Error("MONGODB_URI must be set within .env");

  if (cached.connection) return cached.connection;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, { bufferCommands: false });
  }

  try {
    cached.connection = await cached.promise;
  } catch (err) {
    cached.promise = null;
    throw err;
  }

  console.log("connected To Database ${process.env.NODE_ENV} - ${MONGODB_URI}");
};
