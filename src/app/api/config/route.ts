import { NextResponse } from "next/server";

export async function GET() {
  const config = {
    BASE_URL: process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "",
    AUTH_URL: process.env.AUTH_URL || process.env.NEXT_PUBLIC_AUTH_URL || "",
  };

  return NextResponse.json(config);
}
