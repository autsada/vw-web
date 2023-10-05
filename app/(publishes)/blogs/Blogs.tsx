"use client"

import React, { useState, useCallback, useTransition } from "react"

import FeedTabs from "./FeedTabs"
import ForYouFeed from "./ForYouFeed"
import LatestFeed from "./LatestFeed"
import PopularFeed from "./PopularFeed"
import SidePanel from "./SidePanel"
import ShareModal from "@/components/ShareModal"
import ReportModal from "@/components/ReportModal"
import Mask from "@/components/Mask"
import { useAuthContext } from "@/context/AuthContext"
import { bookmarkPost } from "@/app/actions/publish-actions"
import { BASE_URL } from "@/lib/constants"
import type {
  Maybe,
  FetchPublishesResponse,
  Publish,
} from "@/graphql/codegen/graphql"

interface Props {
  isAuthenticated: boolean
  feed?: string
  // latestResult: Maybe<FetchPublishesResponse> | undefined
  // popularResult: Maybe<FetchPublishesResponse> | undefined
  fetchResult: Maybe<FetchPublishesResponse> | undefined
}

export default function Blogs({
  isAuthenticated,
  feed,
  // latestResult,
  // popularResult,
  fetchResult,
}: Props) {
  const [targetBlog, setTargetBlog] = useState<Publish>()
  const [shareModalVisible, setShareModalVisible] = useState(false)
  const [reportModalVisible, setReportModalVisible] = useState(false)

  // const [isPending, startTransition] = useTransition()
  // const { onVisible: openAuthModal } = useAuthContext()

  // const openShareModal = useCallback((blog: Publish) => {
  //   setShareModalVisible(true)
  //   setTargetBlog(blog)
  // }, [])

  // const closeShareModal = useCallback(() => {
  //   setShareModalVisible(false)
  //   setTargetBlog(undefined)
  // }, [])

  // const openReportModal = useCallback((blog: Publish) => {
  //   setReportModalVisible(true)
  //   setTargetBlog(blog)
  // }, [])

  // const closeReportModal = useCallback(() => {
  //   setReportModalVisible(false)
  //   setTargetBlog(undefined)
  // }, [])

  // const bookmark = useCallback(
  //   (publishId: string, callback: () => void) => {
  //     if (!isAuthenticated) {
  //       openAuthModal("Sign in to bookmark the blog.")
  //     } else {
  //       startTransition(() => bookmarkPost(publishId))
  //       if (callback) callback()
  //     }
  //   },
  //   [isAuthenticated, openAuthModal]
  // )

  // const onShareBlog = useCallback(
  //   async (blog: Publish) => {
  //     if (typeof window === "undefined" || !blog) return

  //     const shareData = {
  //       title: blog.title || "",
  //       text: blog.title || "",
  //       url: `${BASE_URL}/read/${blog.id}`,
  //     }

  //     if (navigator.share && navigator.canShare(shareData)) {
  //       try {
  //         await navigator.share(shareData)
  //       } catch (error) {
  //         console.error(error)
  //       }
  //     } else {
  //       openShareModal(blog)
  //     }
  //   },
  //   [openShareModal]
  // )

  return (
    <>
      <div className="w-full pb-40 sm:pb-20">
        Blogs
        {/* <FeedTabs feed={feed} /> */}
        <div className="lg:flex">
          {/* <div
            className={
              !feed
                ? "block lg:w-[60%] lg:min-h-screen lg:pl-2 lg:pr-5 lg:border-r border-neutral-200"
                : "hidden"
            }
          >
            <ForYouFeed
              fetchResult={fetchResult}
              bookmark={bookmark}
              onShareBlog={onShareBlog}
              openReportModal={openReportModal}
            />
          </div>
          <div
            className={
              feed === "latest"
                ? "block lg:w-[60%] lg:min-h-screen lg:pl-2 lg:pr-5 lg:border-r border-neutral-200"
                : "hidden"
            }
          >
            <LatestFeed
              fetchResult={latestResult}
              bookmark={bookmark}
              onShareBlog={onShareBlog}
              openReportModal={openReportModal}
            />
          </div> */}

          {/* For large device only */}
          {/* <div className="hidden lg:block lg:w-[40%] lg:pl-5 lg:pr-2">
            <SidePanel fetchResult={popularResult} />
          </div> */}
        </div>
        {/* For small-medium device view only */}
        {/* <div className={feed === "popular" ? "block lg:hidden" : "hidden"}>
          <PopularFeed
            fetchResult={popularResult}
            bookmark={bookmark}
            onShareBlog={onShareBlog}
            openReportModal={openReportModal}
          />
        </div> */}
      </div>

      {/* Share modal */}
      {/* {shareModalVisible && targetBlog && (
        <ShareModal
          title={targetBlog.title!}
          closeModal={closeShareModal}
          shareUrl={`${BASE_URL}/read/${targetBlog.id}`}
        />
      )}

      {reportModalVisible && targetBlog && (
        <ReportModal
          title="Report blog"
          publishId={targetBlog.id}
          closeModal={closeReportModal}
        />
      )}

      {isPending && <Mask />} */}
    </>
  )
}
