import { NextResponse } from "next/server"

import { requestLiveStream } from "@/graphql"
import { getAccount } from "@/lib/server"
import type { RequestLiveStreamInput } from "@/graphql/types"

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

  const {
    title,
    description,
    primaryCategory,
    secondaryCategory,
    visibility,
    tags,
    broadcastType,
  } = (await req.json()) as Pick<
    RequestLiveStreamInput,
    | "title"
    | "description"
    | "primaryCategory"
    | "secondaryCategory"
    | "visibility"
    | "tags"
    | "broadcastType"
  >

  if (!title || !primaryCategory || !visibility || !broadcastType)
    throw new Error("Bad input")

  const result = await requestLiveStream({
    idToken,
    signature: data?.signature,
    input: {
      accountId: account.id,
      owner: account.owner,
      profileId: account.defaultProfile.id,
      title,
      description: description || null,
      primaryCategory,
      secondaryCategory: secondaryCategory || null,
      visibility,
      tags: tags || null,
      broadcastType,
    },
  })

  return NextResponse.json(result)
}
