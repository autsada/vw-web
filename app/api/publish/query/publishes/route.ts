import { NextResponse } from "next/server"

import { fetchPublishes, getProfileById } from "@/graphql"
import { getAccount } from "@/lib/server"
import type { QueryPublishType } from "@/graphql/types"

export async function POST(req: Request) {
  const data = await getAccount()
  const account = data?.account
  const idToken = data?.idToken

  const { cursor, publishType } = (await req.json()) as {
    cursor?: string
    publishType?: QueryPublishType
  }

  // Get user profile
  const profile =
    !account || !idToken || !account.defaultProfile
      ? undefined
      : await getProfileById(account?.defaultProfile?.id)

  // Fetch publishes by its type
  const shortsResult = await fetchPublishes({
    requestorId: profile?.id,
    cursor,
    publishType,
  })

  return NextResponse.json({ result: shortsResult })
}
