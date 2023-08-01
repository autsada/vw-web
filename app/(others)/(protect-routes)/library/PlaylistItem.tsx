import React from "react"
import Link from "next/link"
import Image from "next/image"
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
    <div className="w-full sm:w-[240px] flex sm:flex-col gap-x-2 sm:gap-x-0 cursor-pointer">
      <Link href={`/library/${item.id}`}>
        <div className="relative w-[180px] sm:w-full h-[100px] sm:h-[140px] bg-neutral-700 rounded-lg overflow-hidden">
          {pl ? (
            <Image
              src={
                pl.thumbnailType === "custom" && pl.thumbnail
                  ? pl.thumbnail!
                  : pl.playback?.thumbnail!
              }
              alt={item.lastItem?.title!}
              fill
              style={{
                objectFit: pl.publishType === "Short" ? "contain" : "cover",
              }}
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

      <div className="relative mt-1 sm:mt-2 flex-grow sm:flex-grow-0 sm:w-full">
        <Link href={`/library/${item.id}`}>
          <h6 className="text-sm sm:text-base">{item.name}</h6>
        </Link>

        <div className="absolute top-0 right-0 px-[2px]" onClick={onClick}>
          <HiDotsVertical />
        </div>
      </div>
    </div>
  )
}
