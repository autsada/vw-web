import React, { Suspense } from "react"
import { redirect } from "next/navigation"

import VerifyEmail from "./Verify"
import { getAccount } from "@/lib/server"

export default async function Verify() {
  const data = await getAccount()
  const account = data?.account

  // If user already logged in, redirect to homepage
  if (account) {
    redirect("/")
  }

  return (
    <Suspense>
      <VerifyEmail />
    </Suspense>
  )
}
