
import { auth } from "@/lib/auth";
import { mongoClient } from "@/lib/mongodb";
import { toNextJsHandler } from "better-auth/next-js";
import { NextRequest } from "next/server";

const handlers = toNextJsHandler(auth);

export async function GET(request: NextRequest) {
  await mongoClient.connect();
  return handlers.GET(request);
}

export async function POST(request: NextRequest) {
  await mongoClient.connect();
  return handlers.POST(request);
}
