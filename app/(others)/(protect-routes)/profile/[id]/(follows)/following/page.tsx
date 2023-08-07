import React from "react"

import Follows from "../Follows"
import { getAccount } from "@/lib/server"
import { fetchMyFollowing } from "@/graphql"

export const dynamic = "force-dynamic"

export default async function FollowingPage({
  params,
}: {
  params: { id: string }
  children: React.ReactNode
}) {
  const data = await getAccount()
  const account = data?.account
  const idToken = data?.idToken
  const signature = data?.signature

  const profile = account?.defaultProfile
  const isAuthenticated = !!account && !!idToken && !!profile

  const followingResult = !isAuthenticated
    ? undefined
    : await fetchMyFollowing({
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
      fetchResult={followingResult}
      followType="following"
      notFoundText="You haven't followed anyone yet."
    />
  )
}
