
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = await fetch(
      "https://api.abcz.workers.dev/api/bazardor/products",
      {
        cache: "no-store",
      }
    );

    if (!response.ok) {
      throw new Error("API request failed");
    }

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error("Products API error:", error);

    return NextResponse.json(
      { error: "Unable to fetch products" },
      { status: 502 }
    );
  }
}
