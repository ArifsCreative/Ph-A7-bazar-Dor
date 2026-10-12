
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { db, mongoClient } from "@/lib/mongodb";

export const auth = betterAuth({
  database: mongodbAdapter(db, {
    client: mongoClient,
  }),

  emailAndPassword: {
    enabled: true,
  },

  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL,
});
