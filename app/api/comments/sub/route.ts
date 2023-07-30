import { NextResponse } from "next/server"

import { fetchSubComments } from "@/graphql"
import { getAccount } from "@/lib/server"

export async function POST(req: Request) {
  const data = await getAccount()
  const account = data?.account

  const { cursor, commentId } = (await req.json()) as {
    cursor: string
    commentId: string
  }

  if (!commentId) return NextResponse.json({ result: null })

  // Fetch sub-comments of the comment
  const commentsResult = await fetchSubComments({
    requestorId: account?.defaultProfile?.id,
    commentId,
    cursor,
  })

  return NextResponse.json({ result: commentsResult })
}
