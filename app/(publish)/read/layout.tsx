import React from "react"

import SideBar from "@/components/nav/SideBar"
import { getAccount } from "@/lib/server"

export default async function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  const data = await getAccount()
  const account = data?.account || null

  return (
    <>
      <div className="hidden w-[100px] fixed top-[70px] bottom-0 bg-white py-5 px-2 sm:block overflow-y-auto">
        <SideBar isAuthenticated={!!account} />
      </div>

      <div className="sm:ml-[100px]">{children}</div>
    </>
  )
}
