import { NextResponse } from "next/server"

import { fetchMyFollowing } from "@/graphql"
import { getAccount } from "@/lib/server"

export async function POST(req: Request) {
  const data = await getAccount()
  const account = data?.account
  const idToken = data?.idToken
  const signature = data?.signature
  const profile = account?.defaultProfile

  const isAuthenticated = !!profile && !!idToken
  if (!isAuthenticated)
    return new NextResponse("Please sign in to proceed.", {
      status: 500,
    })

  const { cursor } = (await req.json()) as {
    cursor?: string
  }

  const followersResult = !isAuthenticated
    ? undefined
    : await fetchMyFollowing({
        idToken,
        signature,
        input: {
          accountId: account.id,
          owner: account.owner,
          requestorId: profile.id,
          cursor,
        },
      })

  return NextResponse.json({ result: followersResult })
}
