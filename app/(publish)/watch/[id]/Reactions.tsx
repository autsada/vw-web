"use client"

import React from "react"

import LikeReaction from "@/components/LikeReaction"
import TipReaction from "@/components/TipReaction"
import ShareReaction from "@/components/ShareReaction"
import SaveReaction from "@/components/SaveReaction"
import ReportReaction from "@/components/ReportReaction"
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
}

export default function Reactions({
  publish,
  isAuthenticated,
  account,
  playlistsResult,
  publishPlaylistsData,
}: Props) {
  // Subscribe to update on Firestore
  useSubscribeToUpdates(publish?.id)

  return (
    <div className="w-max flex items-center gap-x-2">
      <LikeReaction
        isAuthenticated={isAuthenticated}
        publishId={publish?.id}
        liked={!!publish?.liked}
        likesCount={publish?.likesCount}
        disLiked={!!publish?.disLiked}
        likeButtonWidth={publish?.likesCount > 100 ? "w-[100px]" : "w-[80px]"}
      />
      <TipReaction
        isAuthenticated={isAuthenticated}
        account={account}
        publish={publish}
      />
      <ShareReaction
        publishId={publish?.id}
        publishType={publish?.publishType!}
        title={publish?.title || ""}
      />
      <SaveReaction
        publishId={publish?.id}
        isAuthenticated={isAuthenticated}
        playlistsResult={playlistsResult}
        publishPlaylistsData={publishPlaylistsData}
      />
      <ReportReaction publishId={publish?.id} />
    </div>
  )
}
