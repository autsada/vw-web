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
    return new NextResponse("Please sign in to proceed.", {
      status: 500,
    })

  const idToken = data?.idToken
  if (!idToken)
    return new NextResponse("Please sign in to proceed.", {
      status: 500,
    })

  const { publishId, thumbnail, thumbnailRef } = (await req.json()) as Pick<
    UpdateVideoInput,
    "publishId" | "thumbnail" | "thumbnailRef"
  >

  if (!publishId || !thumbnail || !thumbnailRef)
    return new NextResponse("Bad input.", {
      status: 500,
    })

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
