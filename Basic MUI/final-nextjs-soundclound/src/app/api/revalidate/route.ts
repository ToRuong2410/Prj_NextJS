// Giúp người quản lý thực hiện cập nhật lại dữ liệu khi đã build dự án rồi
import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

// 'your-wesite.com/api/revalidate?tag=collection&secret=<token>'
export async function POST(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get("secret");
  const tag = request.nextUrl.searchParams.get("tag");

  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ message: "Invalid secret..." }, { status: 401 });
  }

  if (!tag) {
    return NextResponse.json({ message: "Missing tag param" }, { status: 400 });
  }

  revalidateTag(tag);

  return NextResponse.json({
    revalidated: true,
    now: Date.now(),
  });
}
