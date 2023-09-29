// Use this component for short item carousel

"use client"

import React from "react"

import LikeReaction from "@/components/LikeReaction"
import TipReaction from "@/components/TipReaction"
import ShareReaction from "@/components/ShareReaction"
import SaveReaction from "@/components/SaveReaction"
import ReportReaction from "@/components/ReportReaction"
import CommentsReaction from "./CommentReaction"
import { useSubscribeToUpdates } from "@/hooks/useSubscribe"
import type {
  CheckPublishPlaylistsResponse,
  FetchPlaylistsResponse,
  Maybe,
  Publish,
  Account,
} from "@/graphql/codegen/graphql"

interface Props {
  publish: Publish
  isAuthenticated: boolean
  account?: Maybe<Account> | undefined
  playlistsResult: Maybe<FetchPlaylistsResponse> | undefined
  publishPlaylistsData: Maybe<CheckPublishPlaylistsResponse> | undefined
  commentAction: () => void
  buttonHeight?: string // h-[40px]
  buttonDescriptionColor?: string // text-white for exp
}

export default function VerticalReactions({
  publish,
  isAuthenticated,
  account,
  playlistsResult,
  publishPlaylistsData,
  commentAction,
  buttonHeight = "h-[35px]",
  buttonDescriptionColor,
}: Props) {
  // Subscribe to update on Firestore
  useSubscribeToUpdates(publish?.id)

  return (
    <div className="w-full flex flex-col items-center justify-end gap-y-5">
      <LikeReaction
        isAuthenticated={isAuthenticated}
        publishId={publish?.id}
        liked={!!publish?.liked}
        likesCount={publish?.likesCount}
        disLiked={!!publish?.disLiked}
        likeButtonHeight={buttonHeight}
        dislikeButtonHeight={buttonHeight}
        verticalLayout
        descriptionColor={buttonDescriptionColor}
      />
      <TipReaction
        isAuthenticated={isAuthenticated}
        account={account}
        publish={publish}
        verticalLayout
        withDescription={false}
        buttonHeight={buttonHeight}
      />
      <ShareReaction
        publishId={publish?.id}
        publishType={publish?.publishType!}
        title={publish?.title || ""}
        withDescription={false}
        verticalLayout
        buttonHeight={buttonHeight}
      />
      <SaveReaction
        publishId={publish?.id}
        isAuthenticated={isAuthenticated}
        playlistsResult={playlistsResult}
        publishPlaylistsData={publishPlaylistsData}
        withDescription={false}
        verticalLayout
        buttonHeight={buttonHeight}
      />
      <ReportReaction
        publishId={publish?.id}
        withDescription={false}
        verticalLayout
        buttonHeight={buttonHeight}
      />
      <CommentsReaction
        commentsCount={publish?.commentsCount}
        commentAction={commentAction}
        verticalLayout
        buttonHeight={buttonHeight}
        descriptionColor={buttonDescriptionColor}
      />
    </div>
  )
}
