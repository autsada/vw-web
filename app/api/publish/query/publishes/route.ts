import { NextResponse } from "next/server"

import { fetchProfilePublishes } from "@/graphql"
import { getAccount } from "@/lib/server"
import type { PublishOrderBy, QueryPublishType } from "@/graphql/types"

export async function POST(req: Request) {
  const data = await getAccount()
  const account = data?.account
  const requestor =
    !account || !account.defaultProfile ? undefined : account.defaultProfile

  const { creatorId, publishType, cursor, sortBy } = (await req.json()) as {
    creatorId: string
    publishType?: QueryPublishType
    cursor?: string
    sortBy?: PublishOrderBy
  }

  // Fetch publishes of the creator
  const fetchResult = await fetchProfilePublishes({
    creatorId,
    requestorId: requestor?.id,
    publishType,
    cursor,
    orderBy: sortBy,
  })

  return NextResponse.json({ result: fetchResult })
}
