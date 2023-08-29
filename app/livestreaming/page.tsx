import React, { Suspense } from "react"
import { redirect } from "next/navigation"

import CreateStream from "./CreateStream"
import { getProfileById } from "@/graphql"
import { getAccount } from "@/lib/server"

export default async function StartStreamPage() {
  const data = await getAccount()
  const account = data?.account

  // Get user profile
  const profile = !account?.defaultProfile
    ? null
    : await getProfileById(account?.defaultProfile?.id)

  if (!profile) {
    redirect("/")
  }

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <Suspense fallback={<div>Loading...</div>}>
        <CreateStream profile={profile} />
      </Suspense>
    </div>
  )
}
