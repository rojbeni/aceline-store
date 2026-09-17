import { NextRequest, NextResponse } from "next/server"
import { revalidateTag } from "next/cache"
export async function GET(request: NextRequest) {

 const tags = request.nextUrl.searchParams.getAll("tags")
 console.log("Revalidating tags:", tags)
 if (!tags.length) {
    return NextResponse.json({ message: "No tags provided" }, { status: 400 })
  }

  try {
    tags.forEach((tag) => revalidateTag(tag))
    return NextResponse.json({ revalidated: true, tags, now: Date.now() })
  } catch (err) {
    return NextResponse.json(
      { message: "Error revalidating", error: String(err) },
      { status: 500 }
    )
  }
}