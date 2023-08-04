import { NextResponse } from "next/server"

import { fetchNotifications } from "@/graphql"
import { getAccount } from "@/lib/server"

export async function POST(req: Request) {
  const data = await getAccount()
  const account = data?.account
  const idToken = data?.idToken
  const signature = data?.signature
  const profile = account?.defaultProfile

  if (!idToken || !profile) return NextResponse.json({ result: null })

  const { cursor } = (await req.json()) as {
    cursor: string
  }

  const notificationsResult = await fetchNotifications({
    idToken,
    signature,
    input: {
      accountId: account?.id,
      owner: account?.owner,
      profileId: profile.id,
      cursor: cursor || null,
    },
  })

  return NextResponse.json({ result: notificationsResult })
}
