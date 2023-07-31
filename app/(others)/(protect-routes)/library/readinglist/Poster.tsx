import React from "react"
import Image from "next/image"

import PlaylistName from "../WL/PlaylistName"
import RemoveAllBtn from "./RemoveAllBtn"
import { DEFAULT_BLOG_COVER_URL } from "@/lib/constants"
import type { Publish, BookmarkEdge } from "@/graphql/codegen/graphql"

interface Props {
  isAuthenticated: boolean
  publish: Publish
  totalItems: number
  setItems: React.Dispatch<React.SetStateAction<BookmarkEdge[]>>
}

export default function Poster({
  isAuthenticated,
  publish,
  totalItems,
  setItems,
}: Props) {
  const thumbnail = publish.thumbnail
  return (
    <div className="h-full w-full md:w-[300px] lg:w-[400px] px-2 sm:px-4 md:px-8 py-6 bg-neutral-200 sm:rounded-lg">
      {publish && totalItems > 0 && (
        <>
          <div className="rounded-lg overflow-hidden flex items-center justify-center bg-black h-[40%] max-h-[40%] text-white">
            <div className="relative w-full h-[200px]">
              <Image
                src={thumbnail || DEFAULT_BLOG_COVER_URL}
                alt={publish.title || ""}
                fill
                style={{ objectFit: "cover" }}
              />
            </div>
          </div>
          <div className="mt-4 mb-1 px-1">
            <PlaylistName
              isAuthenticated={isAuthenticated}
              name="Reading list"
              itemsCount={totalItems}
            />
          </div>
          <p className="mt-2 px-1 text-sm sm:text-base text-textLight">
            {totalItems} blog{totalItems > 1 ? "s" : ""}
          </p>
          <div className="mt-4">
            <RemoveAllBtn setItems={setItems} />
          </div>
        </>
      )}
    </div>
  )
}
