import React, { Suspense } from "react"

import VerifyEmail from "./Verify"
import { getAccount } from "@/lib/server"

export default async function Verify() {
  const data = await getAccount()
  const account = data?.account

  return (
    <Suspense>
      <VerifyEmail account={account} />
    </Suspense>
  )
}
