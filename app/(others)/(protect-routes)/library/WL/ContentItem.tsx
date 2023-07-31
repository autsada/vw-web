import React, { useState, useCallback } from "react"
import Link from "next/link"
import Image from "next/image"
import { HiDotsVertical } from "react-icons/hi"
import { BsDot } from "react-icons/bs"

import VideoPlayer from "@/components/VideoPlayer"
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

export default function ContentItem({ publish, setPOS, onOpenActions }: Props) {
  const thumbnail =
    publish?.thumbnailType === "custom" && publish?.thumbnail
      ? publish?.thumbnail
      : publish?.playback?.thumbnail

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
    <div className="relative w-full md:max-w-[220px] lg:max-w-none bg-white">
      <div className="relative z-0 flex md:flex-col lg:flex-row gap-x-2 sm:gap-x-4 md:gap-y-2 lg:gap-y-0">
        <Link href={`/watch/${publish.id}`}>
          <div
            className="relative w-[180px] sm:w-[200px] md:w-full lg:w-[240px] h-[110px] lg:h-[130px] bg-neutral-700 rounded-xl overflow-hidden"
            onMouseOver={onMouseOn}
            onMouseLeave={onMouseLeave}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={thumbnail || ""}
              alt={publish.title || ""}
              className={`${
                playing || !thumbnail ? "hidden" : "block"
              } w-full h-full object-cover
              `}
            />
            {/* <Image
                src={thumbnail || ""}
                alt={publish.title || ""}
                fill
                style={{
                  objectFit:
                    publish?.publishType === "Short" ? "contain" : "cover",
                }}
              /> */}

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

            {publish.playback && (
              <div className="absolute bottom-2 right-2 px-[2px] rounded-sm bg-white font-thin text-xs flex items-center justify-center">
                {secondsToHourFormat(publish.playback?.duration)}
              </div>
            )}
          </div>
        </Link>

        <div className="flex-grow md:w-[90%] lg:w-auto mr-4 md:pl-2 lg:pl-0">
          <div>
            <Link href={`/watch/${publish.id}`}>
              <h6 className="text-base">
                {getPostExcerpt(publish.title || "", 50)}
              </h6>
            </Link>
            <div className="mt-1">
              <ProfileName profile={publish.creator} fontSize="base" />
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
        </div>
      </div>

      <div
        className="absolute -top-1 md:top-[110px] lg:-top-1 right-0 cursor-pointer py-2 px-1"
        onClick={openActionsModal}
      >
        <HiDotsVertical />
      </div>
    </div>
  )
}
