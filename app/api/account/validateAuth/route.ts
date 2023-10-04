import { NextResponse } from "next/server"

import { validateAuth } from "@/graphql"
import { getAccount } from "@/lib/server"

export async function GET(req: Request) {
  const data = await getAccount()
  const account = data?.account
  const idToken = data?.idToken
  const signature = data?.signature
  const profile = account?.defaultProfile
  if (!account || !profile || !idToken)
    return new NextResponse("Please sign in to proceed.", {
      status: 500,
    })

  const result = await validateAuth({
    idToken,
    signature,
    input: {
      accountId: account.id,
      owner: account.owner,
      profileId: profile.id,
    },
  })

  return NextResponse.json({ isAuthenticated: result?.isAuthenticated })
}
