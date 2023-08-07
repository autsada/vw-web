import React from "react"
import { redirect } from "next/navigation"

import RouteLinks from "./RouteLinks"
import { getAccount } from "@/lib/server"
import { getProfileById } from "@/graphql"

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

  return (
    <>
      <div className="md:fixed md:z-20 md:left-[100px] md:top-[70px] md:bottom-0 sm:py-5">
        <div className="md:h-full flex flex-row md:flex-col gap-x-2 sm:gap-x-0 sm:gap-y-4 w-full md:w-[200px] border-t border-b md:border-l md:border-r md:border-neutral-300 rounded-none md:rounded-lg md:px-4 md:py-5 bg-white">
          <RouteLinks />
        </div>
      </div>
      <div className="p-2 md:px-6 md:py-5">
        <div className="ml-0 md:ml-[200px] pb-20 sm:pb-0">{children}</div>
      </div>
    </>
  )
}
