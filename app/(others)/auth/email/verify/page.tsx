import React, { Suspense } from "react"

import VerifyEmail from "./Verify"

export default async function Verify() {
  return (
    <Suspense>
      <VerifyEmail />
    </Suspense>
  )
}
