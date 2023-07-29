import React, { useState, useCallback } from "react"
import Link from "next/link"
import { HiDotsVertical } from "react-icons/hi"

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
  publish: Publish
  setPOS: (posX: number, posY: number, screenHeight: number) => void
  onOpenActions: (p: Publish) => void
}

export default function RecommendationItem({
  publish,
  setPOS,
  onOpenActions,
}: Props) {
  const [playing, setPlaying] = useState(false)

  const onMouseOn = useCallback(() => {
    setPlaying(true)
  }, [])

  const onMouseLeave = useCallback(() => {
    setPlaying(false)
  }, [])

  const openActionsModal = useCallback(
    (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
      onOpenActions(publish)
      setPOS(e.clientX, e.clientY, window?.innerHeight)
    },
    [publish, setPOS, onOpenActions]
  )

  if (!publish) return null

  return (
    <div className="relative w-full mb-4 sm:mb-2 bg-white">
      <div className="relative z-0 flex flex-col xl:flex-row gap-y-2 md:gap-x-2 sm:gap-y-0">
        <Link href={`/watch/${publish.id}`}>
          <div
            className="relative w-full xl:w-[220px] h-[200px] sm:h-[120px] md:h-[150px] xl:h-[130px] bg-neutral-600 rounded-none sm:rounded-xl overflow-hidden"
            onMouseOver={onMouseOn}
            onMouseLeave={onMouseLeave}
          >
            <VideoPlayer
              playback={publish.playback || undefined}
              controls={playing}
              playing={playing}
              thumbnail={
                publish.publishType === "Short"
                  ? undefined
                  : publish.thumbnailType === "custom" && publish.thumbnail
                  ? publish.thumbnail
                  : publish.playback?.thumbnail
              }
              playIcon={<></>}
            />

            {publish.playback && (
              <div className="absolute bottom-2 right-2 px-[2px] rounded-sm bg-white font-thin text-xs flex items-center justify-center">
                {secondsToHourFormat(publish.playback?.duration)}
              </div>
            )}
          </div>
        </Link>

        <div className="w-full sm:flex-grow flex xl:flex-col gap-x-2 xl:gap-x-0 px-4 sm:px-1 xl:px-0 py-2 xl:py-0">
          <div className="sm:hidden">
            <Avatar profile={publish.creator} />
          </div>
          <div className="pr-4">
            <Link href={`/watch/${publish.id}`}>
              <h6 className="text-base">
                {getPostExcerpt(publish.title || "", 60)}
              </h6>
            </Link>
            <div className="mt-1">
              <ProfileName profile={publish.creator} fontSize="base" />
              <Link href={`/watch/${publish.id}`}>
                <div className="flex items-center gap-x-4">
                  <p className="text-textLight text-sm sm:text-base">
                    {publish.views || 0} views
                  </p>
                  <p className="text-textLight text-sm sm:text-base">
                    {calculateTimeElapsed(publish.createdAt)}
                  </p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div
        className="absolute top-[205px] sm:top-[125px] md:top-[155px] xl:-top-1 right-3 sm:right-0 cursor-pointer py-2 px-1"
        onClick={openActionsModal}
      >
        <HiDotsVertical />
      </div>
    </div>
  )
}
