import React from "react"
import Link from "next/link"
import { MdPlayCircleOutline } from "react-icons/md"
import { HiDotsVertical } from "react-icons/hi"

import { PreviewPlaylist } from "@/graphql/codegen/graphql"

interface Props {
  item: PreviewPlaylist
  onOpenActions: (pl: PreviewPlaylist) => void
  setPOS: (
    posX: number,
    posY: number,
    screenHeight: number,
    screenWidth: number
  ) => void
}

export default function PlaylistItem({ item, onOpenActions, setPOS }: Props) {
  const pl = item.lastItem

  function onClick(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    if (!item) return
    onOpenActions(item)
    setPOS(e.clientX, e.clientY, window?.innerHeight, window?.innerWidth)
  }

  return (
    <div className="w-full grid grid-cols-2 gap-x-1 sm:grid-cols-1 sm:gap-y-2 cursor-pointer">
      <Link href={`/library/${item.id}`}>
        <div className="relative z-0 h-[110px] sm:h-[150px] md:h-[140px] rounded-lg overflow-hidden bg-neutral-500">
          {pl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={
                pl.thumbnailType === "custom" && pl.thumbnail
                  ? pl.thumbnail!
                  : pl.playback?.thumbnail!
              }
              alt={item.lastItem?.title!}
              className={`w-full h-full ${
                pl.publishType === "Short" ? "object-contain" : "object-cover"
              }`}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <MdPlayCircleOutline size={30} className="text-white" />
            </div>
          )}

          <div className="absolute z-10 left-0 bottom-0 right-0 py-2 text-end bg-neutral-800 opacity-80 px-2">
            <p className="font-thin text-white text-xs sm:text-sm">
              {item.count} publish{item.count > 1 ? "es" : ""}
            </p>
          </div>
        </div>
      </Link>
      <div className="relative py-1 sm:py-0 px-1">
        <Link href={`/library/${item.id}`}>
          <div className="h-full mr-5">
            <h6 className="text-sm sm:text-base">{item.name}</h6>
          </div>
        </Link>

        <div className="absolute top-0 right-0 px-1" onClick={onClick}>
          <HiDotsVertical />
        </div>
      </div>
    </div>
  )
}
