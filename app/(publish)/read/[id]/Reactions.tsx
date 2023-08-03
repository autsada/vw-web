"use client"

import React from "react"

import LikeReaction from "@/components/LikeReaction"
import TipReaction from "@/components/TipReaction"
import ShareReaction from "@/components/ShareReaction"
import BookmarkReaction from "./BookmarkReaction"
import ReportReaction from "@/components/ReportReaction"
import { useSubscribeToFirestore } from "@/hooks/useSubscribeToUpdate"
import type { Publish } from "@/graphql/codegen/graphql"

interface Props {
  publish: Publish
  isAuthenticated: boolean
}

export default function Reactions({ publish, isAuthenticated }: Props) {
  // Subscribe to update on Firestore
  useSubscribeToFirestore(publish?.id)

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
