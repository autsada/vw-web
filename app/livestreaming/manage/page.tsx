import React, { Suspense } from "react"
import Link from "next/link"
import { redirect } from "next/navigation"

import { fetchMyLiveStream, getProfileById } from "@/graphql"
import { getAccount } from "@/lib/server"
import ManageLiveStream from "./ManageLiveStream"

export default async function ManagePage() {
  const data = await getAccount()
  const account = data?.account
  const idToken = data?.idToken
  const signature = data?.signature

  if (!idToken || !account?.defaultProfile) {
    redirect("/")
  }

  // Get user profile
  const profile = !account?.defaultProfile
    ? null
    : await getProfileById(account?.defaultProfile?.id)

  if (!profile) {
    redirect("/settings")
  }

  // Check ownership of the profile
  if (account.owner?.toLowerCase() !== profile.owner?.toLowerCase()) {
    redirect("/")
  }

  // First query to all publishes created by the profile.
  const result = await fetchMyLiveStream({
    idToken,
    signature,
    input: {
      accountId: account.id,
      owner: account.owner,
      creatorId: profile.id,
      cursor: null,
    },
  })

  return (
    <Suspense>
      <div className="py-2 flex justify-end">
        <Link href="/livestreaming">
          <button className="mx-0 px-5 bg-blueBase hover:bg-blueLight text-white">
            Create new stream
          </button>
        </Link>
      </div>
      <ManageLiveStream fetchResult={result} />
    </Suspense>
  )
}
