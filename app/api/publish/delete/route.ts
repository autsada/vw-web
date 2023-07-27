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
    throw new Error("Please sign in to proceed.")

  const { publishId } = (await req.json()) as { publishId: string }
  if (!publishId) throw new Error("Bad input")

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
