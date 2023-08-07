import React from "react"

import { getAccount } from "@/lib/server"
import { getProfileById } from "@/graphql"
import { redirect } from "next/navigation"

export default async function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  const data = await getAccount()
  const account = data?.account
  if (!account?.defaultProfile) {
    redirect("/profile")
  }

  // Get user profile
  const profile = await getProfileById(
    account?.defaultProfile?.id,
    account?.defaultProfile?.id
  )

  if (!profile) {
    redirect("/settings")
  }

  // Check ownership of the profile
  if (account.owner?.toLowerCase() !== profile.owner?.toLowerCase()) {
    redirect("/")
  }

  return <>{children}</>
}
