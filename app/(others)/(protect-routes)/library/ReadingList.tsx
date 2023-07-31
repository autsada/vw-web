import React from "react"
import Link from "next/link"
import { BiSpreadsheet } from "react-icons/bi"

import ReadingListItem from "./ReadingListItem"
import type { Maybe, FetchBookmarkResponse } from "@/graphql/codegen/graphql"

interface Props {
  bookmarksResult: Maybe<FetchBookmarkResponse> | undefined
}

export default function ReadingList({ bookmarksResult }: Props) {
  const itemsCount = bookmarksResult?.pageInfo?.count || 0
  const edges = bookmarksResult?.edges || []

  return (
    <>
      <div className="w-full py-5 pb-40 sm:pb-20">
        <div className="mb-5 flex items-center gap-x-8">
          <Link href="/library/readinglist">
            <div className="flex items-start gap-x-4 cursor-pointer">
              <BiSpreadsheet size={22} />
              <div className="flex items-center gap-x-2">
                <h6 className="text-lg sm:text-xl">Reading list</h6>
                {itemsCount > 0 && (
                  <p className="sm:text-lg text-textLight">{itemsCount}</p>
                )}
              </div>
            </div>
            {itemsCount === 0 && (
              <p className="mt-1 text-textLight">
                No blogs in your reading list yet.
              </p>
            )}
          </Link>

          {itemsCount > 0 && (
            <Link href="/library/readinglist">
              <p className="text-blueBase rounded-full cursor-pointer sm:text-lg">
                See all
              </p>
            </Link>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-y-3 lg:gap-y-0 lg:gap-x-5">
          {edges.length > 0 &&
            edges.map((edge) =>
              !edge.node || !edge.node.publish ? null : (
                <div
                  key={edge?.node?.publish?.id}
                  className="bg-neutral-50 hover:bg-neutral-100 px-5 py-2 rounded-md"
                >
                  <ReadingListItem publish={edge?.node?.publish} />
                </div>
              )
            )}
        </div>
      </div>
    </>
  )
}
