import { betterAuth } from "better-auth";   
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { connectionToDatabase } from "@/database/mongoose";
import { nextCookies } from "better-auth/next-js";

const createAuth = (db: Parameters<typeof mongodbAdapter>[0]) =>  // createAuth is a function that creates a Better Auth instance using the MongoDB database object(db)
  betterAuth({                      // Calling Better Auth to create configuration
    database: mongodbAdapter(db),    // Tell Better Auth to use MongoDB as the database and give it the db it should use (mongodbAdapter translates Better Auth's database operations into MongoDB operations.)

    secret: process.env.BETTER_AUTH_SECRET,
    baseURL: process.env.BETTER_AUTH_URL,
    emailAndPassword: {
      enabled: true,
      disableSignUp: false,
      requireEmailVerification: false,
    },

    plugins: [nextCookies()],   // a Better Auth plugin - A common way to keep track of Which user is currently logged in is using cookies.
  });

let authInstance: ReturnType<typeof createAuth> | null = null; // create a variable called authInstance and initially set it to null - if we haven't created Better Auth yet
// ReturnType<typeof createAuth> - We have a function createAuth(it returns a better auth authInstance), instead of manually writing the type of the object it returns we let typescript figure it out

export const getAuth = async () => {   // Give me the Better Auth instance, creating it first if necessary
  if (authInstance) return authInstance;      // check if Better Auth already exists if yes return it

  const mongoose = await connectionToDatabase();   // wait till we get the MongoDB connection and store the returned value
  const db = mongoose.connection.db;     // Using that get the raw mongoDB database

  if (!db) throw new Error("MongoDB connection not found");   // checks if the connection existed, if no give a error

  authInstance = createAuth(db);   // create and store the Better Auth instance
  return authInstance;   // return it
};

export const auth = await getAuth();   // this means - When this module is loaded, call getAuth() and store the resulting Better Auth instance in auth