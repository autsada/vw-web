import React from "react"

import Videos from "./[type]/Videos"
import { getAccount } from "@/lib/server"
import { fetchMyPublishes, getProfileById } from "@/graphql"
import { redirect } from "next/navigation"

export default async function AllPublishes() {
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

  // First query to all publishes created by the profile.
  const result = await fetchMyPublishes({
    idToken,
    signature,
    input: {
      accountId: account.id,
      owner: account.owner,
      creatorId: profile.id,
      publishType: "videos",
      cursor: null,
    },
  })

  return <Videos publishType="videos" fetchResult={result} />
}
