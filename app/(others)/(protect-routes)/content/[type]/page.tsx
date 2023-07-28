import React from "react"
import { redirect } from "next/navigation"

import Videos from "./Videos"
import Blogs from "./Blogs"
import { getAccount } from "@/lib/server"
import { fetchMyPublishes, getProfileById } from "@/graphql"
import type { QueryPublishType } from "@/graphql/types"

export default async function Page({
  params,
}: {
  params: { type: QueryPublishType }
}) {
  const data = await getAccount()
  const account = data?.account
  const idToken = data?.idToken
  const signature = data?.signature

  if (!idToken) {
    redirect("/")
  }

  if (!account?.defaultProfile) {
    redirect("/profile")
  }

  // Get user profile
  const profile = await getProfileById(account?.defaultProfile?.id)

  if (!profile) {
    redirect("/settings")
  }

  // Query all publishes by type.
  const publishType = params.type

  let fetchResult = await fetchMyPublishes({
    idToken,
    signature,
    input: {
      accountId: account.id,
      owner: account.owner,
      creatorId: profile.id,
      publishType,
    },
  })

  return publishType === "blogs" ? (
    <Blogs fetchResult={fetchResult} />
  ) : (
    <Videos fetchResult={fetchResult} />
  )
}
