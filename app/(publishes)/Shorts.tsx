import React, { useState, useEffect } from "react"
import Link from "next/link"

import ShortItem from "./ShortItem"
import { Maybe, FetchPublishesResponse } from "@/graphql/codegen/graphql"
import { PublishCategory } from "@/graphql/types"

interface Props {
  fetchResult: Maybe<FetchPublishesResponse> | undefined
  selectedTab: PublishCategory | "All" | "Live"
}

export default function Shorts({ fetchResult, selectedTab }: Props) {
  const [prevShorts, setPrevShorts] = useState(fetchResult?.edges)
  const [shorts, setShorts] = useState(fetchResult?.edges || [])
  const [prevPageInfo, setPrevPageInfo] = useState(fetchResult?.pageInfo)
  const [pageInfo, setPageInfo] = useState(fetchResult?.pageInfo)
  // When props fetch result changed
  if (fetchResult) {
    if (fetchResult.edges !== prevShorts) {
      setPrevShorts(fetchResult?.edges)
      setShorts(fetchResult?.edges || [])
    }
    if (fetchResult.pageInfo !== prevPageInfo) {
      setPrevPageInfo(fetchResult.pageInfo)
      setPageInfo(fetchResult.pageInfo)
    }
  }

  useEffect(() => {
    const els = document?.getElementsByTagName("video")
    if (els.length > 0) {
      for (let i = 0; i < els.length; i++) {
        els[i].style.objectFit = "cover"
      }
    }
  }, [])

  if (shorts.length === 0) return null

  return (
    <div className={`${selectedTab !== "All" ? "hidden" : "block"}`}>
      <Link href="/shorts">
        <div className="w-max flex items-center gap-x-6">
          <h6 className="text-base sm:text-lg lg:text-xl px-5 sm:px-0">
            Shorts
          </h6>
          <p className="text-blueBase">See all</p>
        </div>
      </Link>
      <div className="mt-5 w-full overflow-x-auto scrollbar-hide">
        <div className="w-max flex gap-x-2 sm:gap-x-4">
          <div className="w-[10px] sm:hidden h-full bg-white"></div>
          {shorts.map((short) =>
            !short.node ? null : (
              <ShortItem key={short.node.id} publish={short.node} />
            )
          )}
          <div className="w-[10px] sm:hidden h-full bg-white"></div>
        </div>
      </div>
    </div>
  )
}
