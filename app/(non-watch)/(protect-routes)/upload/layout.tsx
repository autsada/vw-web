import React, { Suspense } from "react"
import { redirect } from "next/navigation"

import { getAccount } from "@/lib/server"
import InformModal from "./InformModal"

export default async function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  const data = await getAccount()
  const account = data?.account
  const idToken = data?.idToken

  if (!account || !idToken) {
    redirect("/")
  }

  return (
    <div className="px-4 py-2">
      {children}
      {account && !account.defaultProfile && (
        <Suspense>
          <InformModal />
        </Suspense>
      )}
    </div>
  )
}
