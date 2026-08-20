import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { connectionToDatabase } from "@/database/mongoose";
import { nextCookies } from "better-auth/next-js";

export const auth = betterAuth({
  //...
});
