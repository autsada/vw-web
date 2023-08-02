import React, { useEffect, useState, useCallback } from "react"
import Link from "next/link"

import ManageFollow from "@/components/ManageFollow"
import Avatar from "@/components/Avatar"
import VideoPlayer from "@/components/VideoPlayer"
import VerticalReactions from "./VerticalReactions"
import { calculateTimeElapsed, getPostExcerpt } from "@/lib/client"
import { useExpandContent } from "@/hooks/useExpandContent"
import { useCountView } from "@/hooks/useCountView"
import type {
  CheckPublishPlaylistsResponse,
  FetchPlaylistsResponse,
  Maybe,
  Publish,
} from "@/graphql/codegen/graphql"

interface Props {
  isSelected?: boolean
  isPrevious?: boolean
  isAuthenticated: boolean
  publish: Publish
  playlistsResult: Maybe<FetchPlaylistsResponse> | undefined
  publishPlaylistsData: Maybe<CheckPublishPlaylistsResponse> | undefined
  openCommentsModal: () => void
}

export default function MobileViewItem({
  isSelected,
  isAuthenticated,
  publish,
  playlistsResult,
  publishPlaylistsData,
  openCommentsModal,
}: Props) {
  const playback = publish.playback
  const duration = publish.playback?.duration || 0
  const description = publish.description || ""

  // const [publishPlaylistsData, setPublishPlaylistsData] =
  //   useState<CheckPublishPlaylistsResponse>()

  const initialDisplayed = 60
  const { displayedContent, expandContent, shrinkContent } = useExpandContent(
    description,
    initialDisplayed
  ) // For displaying description
  const { videoContainerRef, onReady } = useCountView(publish.id, duration)

  // Set video el style to cover
  useEffect(() => {
    const els = document?.getElementsByTagName("video")
    if (els.length > 0) {
      for (let i = 0; i < els.length; i++) {
        els[i].style.objectFit = "cover"
      }
    }
  }, [])

  // const fetchPublishPlaylistData = useCallback(async () => {
  //   try {
  //     if (!publish || !isAuthenticated) return

  //     // Call the api route to check if the publish already add to any user's playlists
  //     const res = await fetch(`/api/playlist/publish`, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({ publishId: publish.id }),
  //     })
  //     const data = (await res.json()) as {
  //       result: CheckPublishPlaylistsResponse
  //     }
  //     setPublishPlaylistsData(data.result)
  //   } catch (error) {
  //     console.error(error)
  //   }
  // }, [publish, isAuthenticated, setPublishPlaylistsData])
  // // Fetch publish playlist data
  // useEffect(() => {
  //   fetchPublishPlaylistData()
  // }, [fetchPublishPlaylistData])

  if (!playback) return null

  return (
    <div
      id={publish.id}
      className="relative w-full h-[100vh] flex items-center justify-center"
    >
      <div className="relative w-full h-full bg-black">
        <div
          ref={videoContainerRef}
          id="short-mobile-player"
          className="w-full h-full"
        >
          <VideoPlayer
            playback={playback}
            playing={isSelected}
            muted={!isSelected}
            loop={isSelected}
            onReady={onReady}
          />
        </div>

        <div className="absolute left-0 right-20 top-20 py-1 px-2 overflow-y-auto">
          <div className="text-left max-h-[50vh]">
            <h6 className="text-base sm:text-lg text-white">
              {getPostExcerpt(publish.title || "", 40)}
            </h6>
            {publish.tags && publish.tags.split(" ").length > 0 && (
              <div className="mt-1 flex items-center gap-x-4">
                {publish.tags.split(" | ").map((tag) => (
                  <Link key={tag} href={`/tag/${tag}`}>
                    <div className="text-textExtraLight px-2 py-1 rounded-full cursor-pointer hover:bg-neutral-100">
                      #{tag}
                    </div>
                  </Link>
                ))}
              </div>
            )}
            <div className="mt-1 flex items-center gap-x-4 font-thin italic text-xs text-white">
              <p>
                {publish.views || 0} view{publish.views === 1 ? "" : "s"}
              </p>
              <p>{calculateTimeElapsed(publish.createdAt)}</p>
            </div>
            <p className="font-light text-white">
              {displayedContent}{" "}
              {description.length > displayedContent.length && (
                <span
                  className="ml-1 text-sm font-semibold cursor-pointer"
                  onClick={expandContent}
                >
                  Show more
                </span>
              )}
            </p>
            {description.length > initialDisplayed &&
              description.length === displayedContent.length && (
                <p
                  className="mt-2 font-semibold text-sm text-white  cursor-pointer"
                  onClick={shrinkContent}
                >
                  Show less
                </p>
              )}
          </div>
        </div>

        <div className="absolute top-0 bottom-0 right-2 flex flex-col items-center justify-center sm:items-stretch md:items-center gap-y-10">
          <div className="relative w-full flex flex-col items-center justify-center sm:justify-start md:justify-center">
            <Avatar profile={publish.creator} width={50} height={50} />
            <div className="absolute -bottom-[15px] sm:bottom-1 w-full py-1">
              <ManageFollow
                isAuthenticated={isAuthenticated}
                follow={publish.creator}
                ownerHref={""}
                ownerLinkText=""
                useIconStyle
              />
            </div>
          </div>
          <div className="w-[60px] pb-5 flex flex-col items-center justify-end">
            <VerticalReactions
              isAuthenticated={isAuthenticated}
              publish={publish}
              playlistsResult={playlistsResult}
              publishPlaylistsData={publishPlaylistsData}
              commentAction={openCommentsModal}
              buttonHeight="h-[40px]"
              buttonDescriptionColor="text-white"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
