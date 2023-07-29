"use client"

import React from "react"

import VideoPlayer from "@/components/VideoPlayer"
import { useCountView } from "@/hooks/useCountView"
import type { Playback } from "@/graphql/codegen/graphql"

interface Props {
  publishId: string
  playback: Playback
}

export default function PlayerSection({ publishId, playback }: Props) {
  const duration = playback?.duration

  const { videoContainerRef, onReady } = useCountView(publishId, duration)

  return (
    <div ref={videoContainerRef} className="w-full h-full">
      <VideoPlayer playback={playback} playing={true} onReady={onReady} />
    </div>
  )
}
