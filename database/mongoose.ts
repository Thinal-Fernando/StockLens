import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

declare global {                       // This is TypeScript specific and tell TS to add something to the global object
  var mongooseCache: {                   // This defines the global cache
    connection: typeof mongoose | null;    // This stores the actual mongoose connection once we have connected (if connected typeof mongoose if connecting null if nothing has started also null)
    promise: Promise<typeof mongoose> | null;    // This stores the Promise representing an ongoing connection attempt.  (if connected Promise if connecting Promise if nothing has started null)
  };
}

let cached = global.mongooseCache;   // tries to retrieve the cache from the global object.

if (!cached) {
  cached = global.mongooseCache = { connection: null, promise: null };   // meaning if not cached set both to null which means "Nothing has started yet"
}

export const connectionToDatabase = async () => {   // export the function so other files can also use it (asynchronus function - means this function returns a Promise and we can use await)
  if (!MONGODB_URI) throw new Error("MONGODB_URI must be set within .env");

  if (cached.connection) return cached.connection;  // checks if we are already connected, if yes return the connection - so that on second, third, ... consecative connections we dont reconnect and use the same connection

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, { bufferCommands: false });  // check if a connection id already being created - if no, we create a new one (tells mongoose where the db is and to connect to it)  (this is done as a check if multiple connections requests come at the exact same time)
  }

  try {  // waiting for the connection
    cached.connection = await cached.promise;   // cached.promise is async so it can succeed or fail so we wait for the connection to pass and save the result in cached.connection  (this saves the first connection)
  } catch (err) {
    cached.promise = null;
    throw err;
  }

  return cached.connection;


};

