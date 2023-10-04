import { NextResponse } from "next/server"

import { cacheLoggedInSession } from "@/graphql"
import { getAccount } from "@/lib/server"

export async function POST(req: Request) {
  const data = await getAccount()
  const account = data?.account
  const idToken = data?.idToken
  const signature = data?.signature
  const profile = account?.defaultProfile
  if (!account || !profile || !idToken)
    return new NextResponse("Please sign in to proceed.", {
      status: 500,
    })

  const { profileId } = (await req.json()) as {
    profileId: string
  }

  const result = await cacheLoggedInSession({
    idToken,
    signature,
    input: {
      address: account.owner,
      profileId,
      accountId: account.id,
    },
  })
  return NextResponse.json(result)
}
