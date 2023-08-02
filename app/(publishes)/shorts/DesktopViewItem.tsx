import React, { useEffect } from "react"
import Link from "next/link"

import VideoPlayer from "@/components/VideoPlayer"
import ProfileName from "@/components/ProfileName"
import ManageFollow from "@/components/ManageFollow"
import Avatar from "@/components/Avatar"
import Description from "@/app/(publish)/watch/[id]/Description"
import Reactions from "./Reactions"
import Comments from "@/app/(publish)/watch/[id]/Comments"
import { useCountView } from "@/hooks/useCountView"
import { getPostExcerpt, calculateTimeElapsed, formatDate } from "@/lib/client"
import type {
  Maybe,
  Publish,
  Profile,
  FetchCommentsResponse,
  CheckPublishPlaylistsResponse,
  FetchPlaylistsResponse,
} from "@/graphql/codegen/graphql"
import type { CommentsOrderBy } from "@/graphql/types"

interface Props {
  isSelected?: boolean
  isPrevious?: boolean
  isAuthenticated: boolean
  profile: Maybe<Profile> | undefined
  publish: Publish
  onPrev: () => void
  onNext: () => void
  commentsResult: Maybe<FetchCommentsResponse> | undefined
  fetchComments?: (publishId: string, orderBy?: CommentsOrderBy) => void
  playlistsResult: Maybe<FetchPlaylistsResponse> | undefined
  publishPlaylistsData: Maybe<CheckPublishPlaylistsResponse> | undefined
}

export default function DesktopViewItem({
  isSelected,
  isAuthenticated,
  profile,
  publish,
  onPrev,
  onNext,
  commentsResult,
  fetchComments,
  playlistsResult,
  publishPlaylistsData,
}: Props) {
  const playback = publish.playback
  const duration = publish.playback?.duration || 0

  const { videoContainerRef, onReady } = useCountView(publish.id, duration)

  // Register wheel event
  useEffect(() => {
    if (typeof window === "undefined") return
    if (!videoContainerRef?.current) return

    const container = videoContainerRef.current
    let isScrolling = false
    let timeoutId: NodeJS.Timer | undefined = undefined

    function onScroll(e: WheelEvent) {
      if (!isScrolling) {
        if (e.deltaY < 0) {
          onPrev()
        } else if (e.deltaY > 0) {
          onNext()
        }

        isScrolling = true
      }

      // Clear the timeout on each scroll event
      if (timeoutId) clearTimeout(timeoutId)

      // Set a timeout to detect scroll end
      const id = setTimeout(() => {
        isScrolling = false
      }, 200)
      timeoutId = id
    }

    container.addEventListener("wheel", onScroll)

    return () => {
      container.removeEventListener("wheel", onScroll)
    }
  }, [onPrev, onNext, videoContainerRef])

  if (!playback) return null

  return (
    <div id={publish.id} className="relative h-[100vh] flex">
      <div
        id="short-desktop-player"
        ref={videoContainerRef}
        className="w-[500px] min-w-[500px] md:w-[600px] md:min-w-[600px] lg:w-[700px] lg:min-w-[700px] xl:w-[800px] xl:min-w-[800px] h-full bg-black"
      >
        <VideoPlayer
          playback={playback}
          playing={isSelected}
          muted={!isSelected}
          loop={isSelected}
          onReady={onReady}
        />
      </div>

      <div className="w-full h-full bg-white px-5 py-10 text-left border-b border-neutral-400">
        <div className="w-full flex items-start gap-x-4">
          <Avatar profile={publish.creator} />
          <div className="relative flex-grow h-full">
            <ProfileName profile={publish.creator} />
            <p className="text-sm">
              {publish.creator?.followersCount || 0}{" "}
              <span className="text-textExtraLight">Followers</span>
            </p>
          </div>
          <ManageFollow
            isAuthenticated={isAuthenticated}
            follow={publish.creator}
            ownerHref={`/upload/${publish.id}`}
            ownerLinkText="Edit"
          />
        </div>
        <h6 className="mt-4">{getPostExcerpt(publish.title || "", 60)}</h6>
        <Description
          createdAt={publish.createdAt}
          description={publish.description}
          showLen={60}
        />
        <div className="mt-2 flex items-center gap-x-4 font-thin text-sm">
          <p>
            {publish.views || 0} view{publish.views === 1 ? "" : "s"}
          </p>
          <p>
            {!publish.description
              ? formatDate(new Date(publish.createdAt))
              : calculateTimeElapsed(publish.createdAt)}
          </p>
        </div>
        {publish.tags && publish.tags.split(" ").length > 0 && (
          <div className="mt-2 flex items-center gap-x-4">
            {publish.tags.split(" | ").map((tag) => (
              <Link key={tag} href={`/tag/${tag}`}>
                <div className="text-textLight px-2 py-1 rounded-full cursor-pointer hover:bg-neutral-100">
                  #{tag}
                </div>
              </Link>
            ))}
          </div>
        )}

        <div className="mt-2 mb-5 overflow-x-auto scrollbar-hide">
          <Reactions
            publish={publish}
            isAuthenticated={isAuthenticated}
            playlistsResult={playlistsResult || undefined}
            publishPlaylistsData={publishPlaylistsData}
          />
        </div>

        <div className="h-full overflow-y-auto pb-52 border-t border-neutral-200">
          <Comments
            isAuthenticated={isAuthenticated}
            publish={publish}
            profile={profile}
            commentsResult={commentsResult}
            fetchComments={fetchComments}
          />
        </div>
      </div>
    </div>
  )
}
