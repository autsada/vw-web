import React from "react"
import { redirect } from "next/navigation"

import LiveSideBar from "./LiveSideBar"
import { getAccount } from "@/lib/server"

export default async function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  const data = await getAccount()
  const account = data?.account
  const idToken = data?.idToken

  // Check authentication
  if (!data || !account || !idToken) {
    redirect("/")
  }

  return (
    <div className="h-screen pt-[70px] bg-black text-white">
      <div className="hidden w-[100px] fixed top-[70px] bottom-0 bg-neutral-900 py-5 px-2 sm:block overflow-y-auto">
        <LiveSideBar />
      </div>
      <div className="h-full sm:ml-[100px]">{children}</div>
    </div>
  )
}
