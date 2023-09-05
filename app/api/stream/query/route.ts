import { NextResponse } from "next/server"
import { redirect } from "next/navigation"

import { fetchMyLiveStream, getProfileById } from "@/graphql"
import { getAccount } from "@/lib/server"

export async function POST(req: Request) {
  const data = await getAccount()
  const account = data?.account
  const idToken = data?.idToken
  const signature = data?.signature

  if (!idToken) {
    redirect("/")
  }

  if (!account?.defaultProfile) {
    redirect("/profile")
  }

  // Get user profile
  const profile = await getProfileById(account?.defaultProfile?.id)

  if (!profile) {
    redirect("/settings")
  }

  const { cursor } = (await req.json()) as {
    cursor?: string
  }

  const result = await fetchMyLiveStream({
    idToken,
    signature,
    input: {
      accountId: account.id,
      owner: account.owner,
      creatorId: profile.id,
      cursor,
    },
  })

  return NextResponse.json({ result })
}
