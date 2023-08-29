import { NextResponse } from "next/server"

import { updateVideo } from "@/graphql"
import { getAccount } from "@/lib/server"
import type { UpdateVideoInput } from "@/graphql/types"

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

  const { publishId, thumbnail, thumbnailRef } = (await req.json()) as Pick<
    UpdateVideoInput,
    "publishId" | "thumbnail" | "thumbnailRef"
  >

  if (!publishId || !thumbnail || !thumbnailRef) throw new Error("Bad input")

  const result = await updateVideo({
    idToken,
    signature: data?.signature,
    input: {
      accountId: account.id,
      owner: account.owner,
      creatorId: account.defaultProfile.id,
      publishId,
      thumbnail,
      thumbnailRef,
      thumbnailType: "custom",
    },
  })

  return NextResponse.json({ id: result?.id })
}
