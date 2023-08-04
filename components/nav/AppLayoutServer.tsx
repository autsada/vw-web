import React, { Suspense } from "react"

import AppLayoutClient from "./AppLayoutClient"
import TempAppLayout from "./TempAppLayout"
import { getAccount } from "@/lib/server"
import { getUnReadNotifications } from "@/graphql"

export default async function AppLayoutServer() {
  const data = await getAccount()
  const account = data?.account || null
  const idToken = data?.idToken
  const signature = data?.signature

  const profile = account?.defaultProfile
  const isAuthenticated = !!account && !!idToken && !!profile

  // If user has a profile, fetch their notifications
  const unReadCount = !isAuthenticated
    ? undefined
    : await getUnReadNotifications({
        idToken,
        signature,
        input: {
          accountId: account?.id,
          owner: account?.owner,
          profileId: profile.id,
        },
      })

  return (
    <Suspense fallback={<TempAppLayout />}>
      <AppLayoutClient
        account={account}
        isAuthenticated={isAuthenticated}
        unReadCount={unReadCount}
      />
    </Suspense>
  )
}
