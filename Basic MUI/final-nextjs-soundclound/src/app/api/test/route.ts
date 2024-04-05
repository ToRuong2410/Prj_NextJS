import { NextResponse, NextRequest } from "next/server";
function randomInteger(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
export async function GET(request: NextRequest, response: NextResponse) {
  const random = randomInteger(1, 1000000);
  return NextResponse.json({ data: random });
}
