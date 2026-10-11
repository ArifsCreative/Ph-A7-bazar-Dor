import { NextResponse } from "next/server";

export async function GET() {
  try {
    const [productsRes, categoriesRes] = await Promise.all([
      fetch(
        "https://openapi.programming-hero.com/api/bazardor/products"
      ),
      fetch(
        "https://openapi.programming-hero.com/api/bazardor/categories"
      ),
    ]);

    const products = await productsRes.json();
    const categories = await categoriesRes.json();

    return NextResponse.json({
      products,
      categories,
    });

  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to fetch data",
      },
      {
        status: 500,
      }
    );
  }
}