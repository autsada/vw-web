import React from "react"
import { redirect } from "next/navigation"

import FollowTabs from "./FollowTabs"
import { getAccount } from "@/lib/server"
import { getProfileById } from "@/graphql"

export default async function layout({
  params,
  children,
}: {
  params: { id: string }
  children: React.ReactNode
}) {
  const data = await getAccount()
  const account = data?.account
  const idToken = data?.idToken

  if (!data || !account || !idToken) {
    redirect("/")
  }

  if (!account?.defaultProfile) {
    redirect("/profile")
  }

  const profile = await getProfileById(params.id, account?.defaultProfile?.id)
  if (!profile) {
    redirect("/profile")
  }

  // Check ownership of the profile
  if (account.owner?.toLowerCase() !== profile.owner?.toLowerCase()) {
    redirect("/")
  }

  return (
    <div className="w-full mx-auto sm:w-[400px] md:w-[500px]">
      <FollowTabs profileId={profile.id} />
      <div>{children}</div>
    </div>
  )
}
