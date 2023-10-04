import { NextResponse } from "next/server"

import { deletePublish } from "@/graphql"
import { getAccount } from "@/lib/server"

/**
 * Use this api route instead of action server so we can return the result.
 */
export async function POST(req: Request) {
  const data = await getAccount()
  const account = data?.account
  const idToken = data?.idToken

  if (!account || !idToken || !account?.defaultProfile)
    return new NextResponse("Please sign in to proceed.", {
      status: 500,
    })

  const { publishId } = (await req.json()) as { publishId: string }
  if (!publishId)
    return new NextResponse("Bad input.", {
      status: 500,
    })

  const result = await deletePublish({
    idToken,
    signature: data?.signature,
    input: {
      accountId: account.id,
      creatorId: account.defaultProfile.id,
      owner: account.owner,
      publishId,
    },
  })

  return NextResponse.json(result)
}
