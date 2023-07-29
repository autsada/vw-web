import { NextResponse } from "next/server"
import type { Maybe } from "graphql/jsutils/Maybe"

import {
  fetchPublishes,
  fetchVideosByCategory,
  getProfileById,
} from "@/graphql"
import { getAccount } from "@/lib/server"
import type { PublishCategory } from "@/graphql/types"
import type { FetchPublishesResponse } from "@/graphql/codegen/graphql"

export async function POST(req: Request) {
  const data = await getAccount()
  const account = data?.account
  const idToken = data?.idToken

  // Get user profile
  const profile =
    !account || !idToken || !account.defaultProfile
      ? undefined
      : await getProfileById(account?.defaultProfile?.id)
  const requestorId = profile?.id

  const { category, cursor } = (await req.json()) as {
    category: PublishCategory | "All"
    cursor?: string
  }

  let result: Maybe<FetchPublishesResponse> | undefined = undefined

  if (category === "All") {
    result = await fetchPublishes({
      requestorId,
      cursor,
      publishType: "videos",
    })
  } else {
    result = await fetchVideosByCategory({ requestorId, category, cursor })
  }

  return NextResponse.json({ result })
}
