import React from "react"
import { notFound } from "next/navigation"

import ProfileTemplate from "../(protect-routes)/profile/[id]/ProfileTemplate"
import { getAccount } from "@/lib/server"
import { getProfileByName } from "@/graphql"

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { profile: string; tab: string }
}) {
  const data = await getAccount()
  const account = data?.account
  const name = params.profile.replace("%40", "")

  if (!name) {
    notFound()
  }

  // Get user profile
  const profile = await getProfileByName(name, account?.defaultProfile?.id)

  if (!profile) {
    notFound()
  }

  return (
    <div className="w-full px-4 py-2">
      <ProfileTemplate isAuthenticated={!!account} profile={profile} />

      {children}
    </div>
  )
}
