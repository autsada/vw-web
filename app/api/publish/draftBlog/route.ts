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
    return new NextResponse("Please sign in to proceed.", {
      status: 500,
    })

  const idToken = data?.idToken
  if (!idToken)
    return new NextResponse("Please sign in to proceed.", {
      status: 500,
    })

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
