import React, { useState, useCallback } from "react"
import Link from "next/link"
import Image from "next/image"
import { HiDotsVertical } from "react-icons/hi"
import { BsDot } from "react-icons/bs"

import VideoPlayer from "@/components/VideoPlayer"
import {
  calculateTimeElapsed,
  getPostExcerpt,
  secondsToHourFormat,
} from "@/lib/client"
import type { Publish } from "@/graphql/codegen/graphql"

interface Props {
  publish: Publish | null | undefined
  onOpenActions: (p: Publish) => void
  setPOS: (
    posX: number,
    posY: number,
    screenHeight: number,
    screenWidth: number
  ) => void
}

export default function VideoItem({ publish, onOpenActions, setPOS }: Props) {
  const thumbnail =
    publish?.thumbnailType === "custom" && publish?.thumbnail
      ? publish?.thumbnail
      : publish?.playback?.thumbnail
  const [playing, setPlaying] = useState(false)

  function onClick(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    if (!publish) return
    onOpenActions(publish)
    setPOS(e.clientX, e.clientY, window?.innerHeight, window?.innerWidth)
  }

  const onMouseOn = useCallback(() => {
    setPlaying(true)
  }, [])

  const onMouseLeave = useCallback(() => {
    setPlaying(false)
  }, [])

  if (!publish) return null

  return (
    <div className="relative w-full sm:w-[220px] cursor-pointer">
      <div className="relative z-0 flex sm:flex-col gap-x-2 sm:gap-x-0 sm:gap-y-2">
        <Link href={`/watch/${publish.id}`}>
          <div
            className="relative w-[180px] sm:w-full h-[100px] sm:h-[120px] bg-neutral-700 rounded-lg overflow-hidden"
            onMouseOver={onMouseOn}
            onMouseLeave={onMouseLeave}
          >
            <div
              className={`relative h-full w-full ${
                playing || !thumbnail ? "hidden" : "block"
              }`}
            >
              <Image
                src={thumbnail || ""}
                alt={publish.title || ""}
                fill
                style={{
                  objectFit:
                    publish.publishType === "Short" ? "contain" : "cover",
                }}
              />
            </div>
            <div
              className={`${
                !playing && thumbnail ? "hidden" : "block"
              } w-full h-full`}
            >
              <VideoPlayer
                playback={publish.playback || undefined}
                controls={playing}
                playing={playing}
                thumbnail={
                  publish.publishType === "Short" ? undefined : thumbnail
                }
                playIcon={<></>}
              />
            </div>
            {publish.publishType === "Short" ? (
              <div className="absolute bottom-2 right-2 px-[2px] rounded-sm bg-white text-xs flex items-center justify-center">
                SHORT
              </div>
            ) : publish.streamType === "Live" ? (
              <div className="absolute bottom-2 right-2 px-[2px] rounded-sm bg-error text-white text-xs flex items-center justify-center">
                Live
              </div>
            ) : publish.playback ? (
              <div className="absolute bottom-2 right-2 px-[2px] rounded-sm bg-white text-xs flex items-center justify-center">
                {secondsToHourFormat(publish.playback?.duration)}
              </div>
            ) : null}
          </div>
        </Link>

        <div className="flex-grow text-left mr-4">
          <Link href={`/watch/${publish.id}`}>
            <h6 className="text-sm sm:text-base">
              {getPostExcerpt(publish.title || "", 40)}
            </h6>
          </Link>
          <Link href={`/watch/${publish.id}`}>
            <div className="flex items-center gap-x-[2px]">
              <p className="font-light text-textLight text-sm sm:text-base">
                {publish.views || 0} views
              </p>
              <BsDot className="black" />
              <p className="font-light text-textLight text-sm sm:text-base">
                {calculateTimeElapsed(publish.createdAt)}
              </p>
            </div>
          </Link>
        </div>
      </div>

      <div
        className="absolute top-0 sm:top-[135px] right-0 px-[2px]"
        onClick={onClick}
      >
        <HiDotsVertical />
      </div>
    </div>
  )
}
