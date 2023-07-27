import { NextResponse } from "next/server"

import { createDraftVideo } from "@/graphql"
import { getAccount } from "@/lib/server"

export async function POST(req: Request) {
  const data = await getAccount()
  const account = data?.account
  if (!account || !account?.defaultProfile)
    throw new Error("No account/station found.")

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
      filename,
      owner: account.owner,
    },
  })

  return NextResponse.json(result)
}
