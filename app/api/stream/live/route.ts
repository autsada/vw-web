import { NextResponse } from "next/server"

import { goLive } from "@/graphql"
import { getAccount } from "@/lib/server"

/**
 * Use this api route instead of action server so we can return the result.
 */
export async function POST(req: Request) {
  const data = await getAccount()
  const account = data?.account
  if (!account || !account?.defaultProfile)
    return new NextResponse("Please sign in to proceed.", {
      status: 500,
    })

  const idToken = data?.idToken
  if (!idToken)
    return new NextResponse("Please sign in to proceed.", {
      status: 500,
    })

  const { publishId } = (await req.json()) as { publishId: string }

  if (!publishId)
    return new NextResponse("Bad input.", {
      status: 500,
    })

  const result = await goLive({
    idToken,
    signature: data?.signature,
    input: {
      accountId: account.id,
      owner: account.owner,
      profileId: account.defaultProfile.id,
      publishId,
    },
  })

  return NextResponse.json(result)
}
