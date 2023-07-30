import { NextResponse } from "next/server"

import { fetchPublishesByTag, getProfileById } from "@/graphql"
import { getAccount } from "@/lib/server"
import type { QueryPublishType } from "@/graphql/types"

export async function POST(req: Request) {
  const data = await getAccount()
  const account = data?.account
  const idToken = data?.idToken

  // Get user profile
  const profile =
    !account || !idToken || !account.defaultProfile
      ? undefined
      : await getProfileById(account?.defaultProfile?.id)

  const { tag, cursor, publishType } = (await req.json()) as {
    tag: string
    cursor?: string
    publishType: QueryPublishType
  }

  if (!tag) return NextResponse.json({ result: null })

  const fetchResult = await fetchPublishesByTag({
    requestorId: profile?.id,
    cursor,
    tag,
    publishType,
  })

  return NextResponse.json({ result: fetchResult })
}
