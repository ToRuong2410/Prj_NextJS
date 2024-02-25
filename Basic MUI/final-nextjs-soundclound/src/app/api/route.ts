import { NextRequest, NextResponse } from "next/server";

// Truy cập tới BE và gửi đi đường link BE động
export async function GET(request: NextRequest, response: NextResponse) {
  // connext to database
  // CRUD database
  // return response for client

  // Lấy thông tin tên 'audio' ở đường link url bên wave track
  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);
  const fileName = searchParams.get("audio");

  console.log(">>>check>>>", request);

  //   GET: đường link tới Backend
  return await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/tracks/${fileName}`
  );
}
