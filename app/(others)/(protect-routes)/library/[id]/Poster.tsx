import React from "react"
import Image from "next/image"

import PlaylistName from "../WL/PlaylistName"
import RemoveAllBtn from "./RemoveAllBtn"
import type { PlaylistItemEdge, Publish } from "@/graphql/codegen/graphql"

interface Props {
  playlistId: string
  isAuthenticated: boolean
  publish: Publish
  totalItems: number
  setItems: React.Dispatch<React.SetStateAction<PlaylistItemEdge[]>>
  playlistName: string
  playlistDescription?: string
}

export default function Poster({
  playlistId,
  isAuthenticated,
  publish,
  totalItems,
  setItems,
  playlistName,
  playlistDescription,
}: Props) {
  return (
    <div className="h-full w-full md:w-[300px] lg:w-[400px] px-2 sm:px-4 md:px-8 py-6 bg-neutral-200  sm:rounded-lg">
      {publish && totalItems > 0 && (
        <>
          <div className="rounded-lg overflow-hidden flex items-center justify-center bg-black max-h-[50%]">
            <div className="relative w-full h-[200px]">
              <Image
                src={
                  publish.thumbnailType === "custom" && publish.thumbnail
                    ? publish.thumbnail
                    : publish.playback?.thumbnail!
                }
                alt={publish.title || ""}
                fill
                style={{ objectFit: "cover" }}
              />
            </div>
          </div>
          <div className="mt-4 mb-1 px-1">
            <PlaylistName
              playlistId={playlistId}
              isAuthenticated={isAuthenticated}
              name={playlistName}
              description={playlistDescription}
              itemsCount={totalItems}
            />
          </div>
          <p className="mt-2 px-1 text-sm sm:text-base text-textLight">
            {totalItems} publish{totalItems > 1 ? "es" : ""}
          </p>
          <div className="mt-4">
            <RemoveAllBtn
              playlistId={playlistId}
              playlistName={playlistName}
              setItems={setItems}
            />
          </div>
        </>
      )}
    </div>
  )
}
