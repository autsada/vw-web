import { NextResponse } from "next/server"

import { fetchPublishesByQuery, getProfileById } from "@/graphql"
import { getAccount } from "@/lib/server"

export async function POST(req: Request) {
  const data = await getAccount()
  const account = data?.account
  const idToken = data?.idToken

  // Get user profile
  const profile =
    !account || !idToken || !account.defaultProfile
      ? undefined
      : await getProfileById(account?.defaultProfile?.id)

  const { query, cursor } = (await req.json()) as {
    query: string
    cursor?: string
  }

  if (!query) return NextResponse.json({ result: null })

  const fetchResult = await fetchPublishesByQuery({
    requestorId: profile?.id,
    cursor,
    query,
    publishType: "all",
  })

  return NextResponse.json({ result: fetchResult })
}
