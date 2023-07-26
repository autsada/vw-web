import { useState, useCallback, useRef, useTransition, useEffect } from "react"

import { countPublishViews } from "@/app/(watch)/watch/[id]/actions"

export function useCountView(publishId: string, duration: number) {
  const [intervalId, setIntervalId] = useState<NodeJS.Timer>()

  const [isPending, startTransition] = useTransition()
  const videoContainerRef = useRef<HTMLDivElement>(null)

  // Clear interval when unmount
  useEffect(() => {
    return () => {
      if (intervalId) {
        clearInterval(intervalId)
      }
    }
  }, [intervalId])

  const countViews = useCallback(() => {
    startTransition(() => countPublishViews(publishId))
  }, [publishId])

  const onStartWatching = useCallback(
    (video: HTMLVideoElement) => {
      let playedDuration = 0
      let id: NodeJS.Timer | undefined = undefined
      let isCounted = false

      const startTimer = () => {
        if (isCounted) return

        id = setInterval(() => {
          playedDuration += 1

          // Videos from 30 sec to 1 min
          if (duration >= 30 && duration <= 60) {
            if (playedDuration >= 30) {
              clearInterval(id)
              countViews()
              isCounted = true
            }
          }

          // Videos between 1-2 mins
          if (duration > 60 && duration <= 120) {
            if (playedDuration >= 45) {
              clearInterval(id)
              countViews()
              isCounted = true
            }
          }

          // Videos greater than 2 mins
          if (duration > 120) {
            // 2 min or longer videos
            if (playedDuration >= 60) {
              clearInterval(id)
              countViews()
              isCounted = true
            }
          }
        }, 1000)
        setIntervalId(id)
      }

      const pauseTimer = () => {
        if (id) {
          clearInterval(id)
        }
      }

      const endTimer = () => {
        pauseTimer()

        // Videos less than 30 secs, will only count view on end
        if (isCounted) return
        if (duration < 30) {
          countViews()
          isCounted = true
        }
      }

      if (video) {
        video.addEventListener("play", startTimer)
        video.addEventListener("pause", pauseTimer)
        video.addEventListener("ended", endTimer)
      }
    },
    [duration, countViews]
  )

  const onReady = useCallback(() => {
    const wrapper = videoContainerRef?.current
    if (wrapper) {
      const container = wrapper.children[0]
      if (container) {
        const vid = container.children[0] as HTMLVideoElement
        if (vid) {
          onStartWatching(vid)
        }
      }
    }
  }, [onStartWatching])

  return { onReady, videoContainerRef }
}
