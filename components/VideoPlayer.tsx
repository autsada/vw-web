"use client"

import type { JSXElementConstructor, ReactElement } from "react"
import Player from "react-player"

import type { Maybe, Playback } from "@/graphql/codegen/graphql"

interface Props {
  playback: Maybe<Playback> | undefined
  playing?: boolean
  muted?: boolean
  controls?: boolean
  thumbnail?: string
  playIcon?: ReactElement<any, string | JSXElementConstructor<any>> | undefined
  onReady?: () => void
  loop?: boolean
}

export default function VideoPlayer({
  playback,
  playing = false,
  muted = true,
  controls = true,
  thumbnail,
  playIcon,
  onReady,
  loop = false,
}: Props) {
  if (!playback) return null

  return (
    <Player
      url={playback?.hls}
      controls={controls}
      light={playing ? undefined : thumbnail || undefined}
      width="100%"
      height="100%"
      pip={true}
      playsinline={true}
      muted={muted}
      playing={playing}
      playIcon={playIcon}
      onReady={onReady}
      loop={loop}
    />
  )
}
