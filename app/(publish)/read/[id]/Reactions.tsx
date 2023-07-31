"use client"

import React, { useEffect } from "react"
// import { useRouter } from "next/navigation"
// import { onSnapshot, doc } from "firebase/firestore"

import LikeReaction from "@/components/LikeReaction"
import TipReaction from "@/components/TipReaction"
import ShareReaction from "@/components/ShareReaction"
import BookmarkReaction from "./BookmarkReaction"
import ReportReaction from "@/components/ReportReaction"

// import { db, publishesCollection } from "@/firebase/config"
import type { Publish } from "@/graphql/codegen/graphql"

interface Props {
  publish: Publish
  isAuthenticated: boolean
}

export default function Reactions({ publish, isAuthenticated }: Props) {
  // const router = useRouter()

  // // Listen to update in Firestore
  // useEffect(() => {
  //   if (!publish?.id) return

  //   const unsubscribe = onSnapshot(
  //     doc(db, publishesCollection, publish?.id),
  //     (doc) => {
  //       // Reload data to get the most updated publish
  //       router.refresh()
  //     }
  //   )

  //   return unsubscribe
  // }, [router, publish?.id])

  return (
    <div className="w-max flex items-center gap-x-2">
      <LikeReaction
        isAuthenticated={isAuthenticated}
        publishId={publish?.id}
        liked={!!publish?.liked}
        likesCount={publish?.likesCount}
        disLiked={!!publish?.disLiked}
        likeButtonWidth={publish?.likesCount > 100 ? "w-[100px]" : "w-[80px]"}
        dislikeButtonWidth="w-[60px]"
      />
      <BookmarkReaction
        isAuthenticated={isAuthenticated}
        publish={publish}
        buttonWidth="w-[60px]"
      />
      <TipReaction
        isAuthenticated={isAuthenticated}
        publish={publish}
        withDescription={false}
        buttonWidth="w-[60px]"
      />
      <ShareReaction
        publishId={publish?.id}
        publishType={publish?.publishType!}
        title={publish?.title || ""}
        withDescription={false}
        buttonWidth="w-[60px]"
      />
      <ReportReaction
        title="Report this blog"
        publishId={publish?.id}
        withDescription={false}
        buttonWidth="w-[60px]"
      />
    </div>
  )
}
