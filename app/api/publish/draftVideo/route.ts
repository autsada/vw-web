import { NextResponse } from "next/server"

import { createDraftVideo } from "@/graphql"
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

  const { filename } = (await req.json()) as { filename: string }
  if (!filename) throw new Error("Bad input")

  const result = await createDraftVideo({
    idToken,
    signature: data?.signature,
    input: {
      accountId: account.id,
      creatorId: account.defaultProfile.id,
      owner: account.owner,
      filename,
    },
  })

  return NextResponse.json(result)
}
