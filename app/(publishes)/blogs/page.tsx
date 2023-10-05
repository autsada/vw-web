import React from "react"

import Blogs from "./Blogs"
import { getAccount } from "@/lib/server"
import { getProfileById, fetchPublishes } from "@/graphql"

interface Props {
  searchParams: { feed?: string }
}

export default async function Page({ searchParams }: Props) {
  const data = await getAccount()
  const account = data?.account
  const idToken = data?.idToken

  // Get user profile
  const profile =
    !account || !idToken || !account.defaultProfile
      ? undefined
      : await getProfileById(account?.defaultProfile?.id)

  const feed = searchParams.feed

  // Fetch blogs (for you)
  const blogsResult = await fetchPublishes({
    requestorId: profile?.id,
    cursor: null,
    publishType: "blogs",
  })

  // Fetch blogs (latest)
  const latestResult = await fetchPublishes({
    requestorId: profile?.id,
    cursor: null,
    publishType: "blogs",
    orderBy: "latest",
  })

  // Fetch blogs (popular)
  const popularResult = await fetchPublishes({
    requestorId: profile?.id,
    cursor: null,
    publishType: "blogs",
    orderBy: "popular",
  })

  return (
    <div className="px-2 sm:px-4 py-2 sm:ml-[100px]">
      <Blogs
        isAuthenticated={!!account}
        feed={feed}
        fetchResult={blogsResult}
        // latestResult={latestResult}
        popularResult={popularResult}
      />
    </div>
  )
}
