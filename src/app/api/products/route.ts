
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = await fetch(
      "https://openapi.programming-hero.com/api/bazardor/products",
      { cache: "no-store" }
    );

    if (!response.ok) {
      throw new Error(`API status: ${response.status}`);
    }

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error("Products API error:", error);

    return NextResponse.json(
      { error: "Failed to load products" },
      { status: 502 }
    );
  }
}
