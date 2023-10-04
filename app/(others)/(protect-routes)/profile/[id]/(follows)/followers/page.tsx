import React from "react"

import Follows from "../Follows"
import { getAccount } from "@/lib/server"
import { fetchMyFollowers } from "@/graphql"

export const dynamic = "force-dynamic"

export default async function FollowingPage({
  params,
}: {
  params: { id: string }
}) {
  const data = await getAccount()
  const account = data?.account
  const idToken = data?.idToken
  const signature = data?.signature

  const profile = account?.defaultProfile
  const isAuthenticated = !!account && !!idToken && !!profile

  const followersResult = !isAuthenticated
    ? undefined
    : await fetchMyFollowers({
        idToken,
        signature,
        input: {
          accountId: account.id,
          owner: account.owner,
          requestorId: profile.id,
        },
      })

  return (
    <Follows
      isAuthenticated={isAuthenticated}
      fetchResult={followersResult}
      followType="followers"
      notFoundText="You don't have follows."
    />
  )
}
