import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { connectionToDatabase } from "@/database/mongoose";
import { nextCookies } from "better-auth/next-js";

const createAuth = (db: any) =>
  betterAuth({
    database: mongodbAdapter(db),

    secret: process.env.BETTER_AUTH_SECRET,
    baseURL: process.env.BETTER_AUTH_URL,
    emailAndPassword: {
      enabled: true,
      disableSignUp: false,
      requireEmailVerification: false,
    },

    plugins: [nextCookies()],
  });

let authInstance: ReturnType<typeof createAuth> | null = null;

export const getAuth = async () => {
  if (authInstance) return authInstance;

  const mongoose = await connectionToDatabase();
  const db = mongoose.connection.db;

  if (!db) throw new Error("MongoDB connection not found");

  authInstance = createAuth(db);
  return authInstance;
};

export const auth = await getAuth();