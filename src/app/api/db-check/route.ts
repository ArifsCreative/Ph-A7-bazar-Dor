
import { NextResponse } from "next/server";
import { db, mongoClient } from "@/lib/mongodb";

export async function GET() {
  try {
    await mongoClient.connect();

    await db.command({ ping: 1 });

    return NextResponse.json({
      ok: true,
      message: "Shared MongoDB client connected",
    });
  } catch (error) {
    console.error("Shared MongoDB client error:", error);

    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.name
            : "UNKNOWN_ERROR",
      },
      { status: 500 }
    );
  }
}
