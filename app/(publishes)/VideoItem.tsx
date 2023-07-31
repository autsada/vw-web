import React, { useState, useCallback } from "react"
import Link from "next/link"
import Image from "next/image"
import { HiDotsVertical } from "react-icons/hi"
import { BsDot } from "react-icons/bs"

import VideoPlayer from "@/components/VideoPlayer"
import Avatar from "@/components/Avatar"
import ProfileName from "@/components/ProfileName"
import {
  calculateTimeElapsed,
  getPostExcerpt,
  secondsToHourFormat,
} from "@/lib/client"
import type { Publish } from "@/graphql/codegen/graphql"

interface Props {
  publish: Publish | null | undefined
  onOpenActions: (p: Publish) => void
  setPOS: (posX: number, posY: number, screenHeight: number) => void
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
    setPOS(e.clientX, e.clientY, window?.innerHeight)
  }

  const onMouseOn = useCallback(() => {
    setPlaying(true)
  }, [])

  const onMouseLeave = useCallback(() => {
    setPlaying(false)
  }, [])

  if (!publish) return null

  return (
    <div className="relative w-full md:w-full lg:max-w-[380px] bg-white cursor-pointer">
      <Link href={`/watch/${publish.id}`}>
        <div
          className="relative h-[240px] sm:h-[300px] md:h-[180px] lg:h-[220px] xl:h-[200px] bg-neutral-700 rounded-none sm:rounded-xl overflow-hidden"
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
                  publish?.publishType === "Short" ? "contain" : "cover",
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
          <div className="absolute bottom-2 right-2 px-[2px] rounded-sm bg-white text-xs flex items-center justify-center">
            {publish.publishType === "Short"
              ? "SHORT"
              : publish.playback
              ? secondsToHourFormat(publish.playback?.duration)
              : null}
          </div>
        </div>
      </Link>

      <div className="flex items-start py-4 px-2 sm:px-0 gap-x-2">
        <Avatar profile={publish.creator} />
        <div className="w-full text-left mr-8">
          <Link href={`/watch/${publish.id}`}>
            <h6 className="text-base sm:text-lg">
              {getPostExcerpt(publish.title || "", 60)}
            </h6>
          </Link>
          <ProfileName profile={publish.creator} />
          <Link href={`/watch/${publish.id}`}>
            <div className="flex items-center gap-x-[2px]">
              <p className="font-light text-textLight text-sm sm:text-base">
                {publish.views || 0} view{publish.views === 1 ? "" : "s"}
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
        className="absolute top-[250px] sm:top-[310px] md:top-[190px] lg:top-[230px] xl:top-[210px] right-2 sm:right-0 py-2 px-1"
        onClick={onClick}
      >
        <HiDotsVertical />
      </div>
    </div>
  )
}
