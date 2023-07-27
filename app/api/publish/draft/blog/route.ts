import { NextResponse } from "next/server"

import { createDraftBlog } from "@/graphql"
import { getAccount } from "@/lib/server"

/**
 * Use this api route instead of action server so we can return the result.
 */
export async function POST(req: Request) {
  const data = await getAccount()
  const account = data?.account
  if (!account || !account?.defaultProfile)
    throw new Error("Please sign in to proceed.")

  const idToken = data?.idToken
  if (!idToken) throw new Error("Please sign in to proceed.")

  const result = await createDraftBlog({
    idToken,
    signature: data?.signature,
    input: {
      accountId: account.id,
      creatorId: account.defaultProfile.id,
      owner: account.owner,
    },
  })

  return NextResponse.json(result)
}
