import { NextResponse } from "next/server"

import { fetchComments } from "@/graphql"
import { getAccount } from "@/lib/server"
import type { CommentsOrderBy } from "@/graphql/types"

export async function POST(req: Request) {
  const data = await getAccount()
  const account = data?.account

  const { cursor, publishId, sortBy } = (await req.json()) as {
    cursor: string
    publishId: string
    sortBy?: CommentsOrderBy
  }

  if (!publishId) return NextResponse.json({ result: null })

  // Fetch comments of the publish
  const commentsResult = await fetchComments({
    requestorId: account?.defaultProfile?.id,
    publishId,
    cursor,
    orderBy: sortBy,
  })

  return NextResponse.json({ result: commentsResult })
}
