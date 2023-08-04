import { NextResponse } from "next/server"

import { getUnReadNotifications } from "@/graphql"
import { getAccount } from "@/lib/server"

export async function GET(req: Request) {
  const data = await getAccount()
  const account = data?.account
  const idToken = data?.idToken
  const signature = data?.signature
  const profile = account?.defaultProfile

  if (!idToken || !profile) return NextResponse.json({ result: null })

  const unreadResult = await getUnReadNotifications({
    idToken,
    signature,
    input: {
      accountId: account?.id,
      owner: account?.owner,
      profileId: profile.id,
    },
  })

  return NextResponse.json({ result: unreadResult })
}
