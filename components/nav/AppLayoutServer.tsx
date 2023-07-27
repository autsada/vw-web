import React, { Suspense } from "react"

import AppLayoutClient from "./AppLayoutClient"
import TempAppLayout from "./TempAppLayout"
import { getAccount } from "@/lib/server"

export default async function AppLayoutServer() {
  const data = await getAccount()
  const account = data?.account || null

  return (
    <Suspense fallback={<TempAppLayout />}>
      <AppLayoutClient account={account} isAuthenticated={!!account} />
    </Suspense>
  )
}
