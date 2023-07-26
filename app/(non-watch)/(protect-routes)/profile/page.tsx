import React, { Suspense } from "react"
import { redirect } from "next/navigation"

import Profile from "./Profile"
import PageLoader from "@/components/PageLoader"
import { getAccount } from "@/lib/server"

export default async function Page() {
  const data = await getAccount()
  const account = data?.account

  if (!account) {
    redirect("/")
  }

  if (account?.defaultProfile) {
    redirect(`/profile/${account.defaultProfile.id}`)
  }

  return (
    <Suspense fallback={<PageLoader />}>
      <Profile account={account} />
    </Suspense>
  )
}
