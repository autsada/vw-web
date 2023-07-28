import React from "react"

import PublishTabs from "./PublishTabs"
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

  return (
    <div className="px-5">
      <PublishTabs profile={profile} />
      <div className="mt-4">{children}</div>
    </div>
  )
}
