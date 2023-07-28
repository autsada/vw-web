import { NextResponse } from "next/server"
import { redirect } from "next/navigation"

import { fetchMyPublishes, getProfileById } from "@/graphql"
import { getAccount } from "@/lib/server"
import type { QueryPublishType } from "@/graphql/types"

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

  const { publishType, cursor } = (await req.json()) as {
    publishType: QueryPublishType
    cursor?: string
  }

  const result = await fetchMyPublishes({
    idToken,
    signature,
    input: {
      accountId: account.id,
      owner: account.owner,
      creatorId: profile.id,
      publishType,
      cursor,
    },
  })

  return NextResponse.json({ result })
}
