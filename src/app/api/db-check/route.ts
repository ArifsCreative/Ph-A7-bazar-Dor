
import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";

export async function GET() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    return NextResponse.json(
      { ok: false, error: "MONGODB_URI_MISSING" },
      { status: 500 }
    );
  }

  const client = new MongoClient(uri, {
    serverSelectionTimeoutMS: 8000,
  });

  try {
    await client.connect();
    await client.db("bazardor").command({ ping: 1 });

    return NextResponse.json({
      ok: true,
      message: "MongoDB connected",
    });
  } catch (error) {
    console.error("MongoDB connectivity test:", error);

    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error ? error.name : "UNKNOWN_ERROR",
      },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}
