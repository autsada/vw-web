import React, { useState, useCallback } from "react"
import Link from "next/link"
import { isMobile } from "react-device-detect"

import VideoPlayer from "@/components/VideoPlayer"
import { getPostExcerpt } from "@/lib/client"
import type { Publish } from "@/graphql/codegen/graphql"

interface Props {
  publish: Publish
}

export default function ShortItem({ publish }: Props) {
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

  if (!publish) return null

  return (
    <Link
      href={isMobile ? `/shorts?id=${publish.id}` : `/shorts/${publish.id}`}
      scroll={false}
    >
      <div
        className="relative h-[280px] w-[160px] sm:h-[300px] sm:w-[180px] md:h-[380px] md:w-[220px] flex items-center justify-center rounded-xl overflow-hidden bg-neutral-300 cursor-pointer"
        onMouseOver={onMouseOn}
        onMouseLeave={onMouseLeave}
      >
        <VideoPlayer
          playback={publish.playback || undefined}
          controls={playing}
          playing={playing}
          thumbnail={thumbnail}
          playIcon={<></>}
        />
        <div className="absolute top-0 w-full py-1 px-2">
          <h6 className="text-base sm:text-lg text-white">
            {getPostExcerpt(publish.title || "", 40)}
          </h6>
          <p className="font-light text-sm sm:text-base text-white">
            {publish.views || 0} view{publish.views === 1 ? "" : "s"}
          </p>
        </div>
      </div>
    </Link>
  )
}
