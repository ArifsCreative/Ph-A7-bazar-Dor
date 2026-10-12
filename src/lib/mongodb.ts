
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error("MONGODB_URI is missing from .env.local");
}

const globalForMongo = globalThis as typeof globalThis & {
  _mongoClient?: MongoClient;
};

export const mongoClient =
  globalForMongo._mongoClient ??
  new MongoClient(uri, {
    maxPoolSize: 10,
  });

if (process.env.NODE_ENV !== "production") {
  globalForMongo._mongoClient = mongoClient;
}

export const db = mongoClient.db("bazardor");
