import type { Maybe, Playlist, Query } from "./codegen/graphql"
import type {
  NexusGenFieldTypes,
  NexusGenArgTypes,
  NexusGenEnums,
  NexusGenInputs,
} from "./typegen"

export type QueryReturnType<T extends keyof Query> = {
  [k in T]: Query[T]
}
export type QueryArgsType<T extends keyof NexusGenArgTypes["Query"]> =
  NexusGenArgTypes["Query"][T]

export type MutationReturnType<T extends keyof NexusGenFieldTypes["Mutation"]> =
  {
    [k in T]: NexusGenFieldTypes["Mutation"][T]
  }
export type MutationArgsType<T extends keyof NexusGenArgTypes["Mutation"]> =
  NexusGenArgTypes["Mutation"][T]

// Account
export type CacheSessionInput = NexusGenInputs["CacheSessionInput"]
export type ValidateAuthInput = NexusGenInputs["ValidateAuthInput"]

// Profile
export type QueryByIdInput = NexusGenInputs["QueryByIdInput"]
export type CreateProfileInput = NexusGenInputs["CreateProfileInput"]
export type UpdateNameInput = NexusGenInputs["UpdateNameInput"]
export type UpdateImageInput = NexusGenInputs["UpdateImageInput"]
export type FollowInput = NexusGenInputs["FollowInput"]
export type UpdatePreferencesInput = NexusGenInputs["UpdatePreferencesInput"]
export type FetchFollowsInput = NexusGenInputs["FetchFollowsInput"]

// Publish
export type PublishType = NexusGenEnums["PublishType"]
export type ThumbnailType = NexusGenEnums["ThumbnailType"]
export type PublishCategory = NexusGenEnums["Category"]
export type PublishVisibility = NexusGenEnums["Visibility"]
export type QueryPublishType = NexusGenEnums["QueryPublishType"]
export type PublishOrderBy = NexusGenEnums["PublishOrderBy"]
export type StreamType = NexusGenEnums["StreamType"]
export type BroadcastType = NexusGenEnums["BroadcastType"]
export type FetchMyPublishesInput = NexusGenInputs["FetchMyPublishesInput"]
export type FetchPublishesInput = NexusGenInputs["FetchPublishesInput"]
export type FetchSuggestedPublishesInput =
  NexusGenInputs["FetchSuggestedPublishesInput"]
export type FetchPublishesByCatInput =
  NexusGenInputs["FetchPublishesByCatInput"]
export type FetchPublishesByProfileInput =
  NexusGenInputs["FetchPublishesByProfileInput"]
export type FetchPublishesByTagInput =
  NexusGenInputs["FetchPublishesByTagInput"]
export type FetchPublishesByQueryStringInput =
  NexusGenInputs["FetchPublishesByQueryStringInput"]
export type FetchLiveVideosInput = NexusGenInputs["FetchLiveVideosInput"]
export type CreateDraftVideoInput = NexusGenInputs["CreateDraftVideoInput"]
export type CreateDraftBlogInput = NexusGenInputs["CreateDraftBlogInput"]
export type UpdateVideoInput = NexusGenInputs["UpdateVideoInput"]
export type UpdateBlogInput = NexusGenInputs["UpdateBlogInput"]
export type LikePublishInput = NexusGenInputs["LikePublishInput"]
export type DeletePublishInput = NexusGenInputs["DeletePublishInput"]
export type DeletePublishesInput = NexusGenInputs["DeletePublishesInput"]
export type RequestLiveStreamInput = NexusGenInputs["RequestLiveStreamInput"]
export type GoLiveInput = NexusGenInputs["GoLiveInput"]
export type GetLiveStreamPublishInput =
  NexusGenInputs["GetLiveStreamPublishInput"]
export type SendTipsInput = NexusGenInputs["SendTipsInput"]
export type TipAmount = 1 | 2 | 5 | 10 | 25 | 50 | 100 | 1000 | 2000

// Comment
export type CommentsOrderBy = NexusGenEnums["CommentsOrderBy"]
export type CommentType = NexusGenEnums["CommentType"]
export type FetchCommentsByPublishIdInput =
  NexusGenInputs["FetchCommentsByPublishIdInput"]
export type FetchSubCommentsInput = NexusGenInputs["FetchSubCommentsInput"]
export type CommentPublishInput = NexusGenInputs["CommentPublishInput"]
export type LikeCommentInput = NexusGenInputs["LikeCommentInput"]
export type DeleteCommentInput = NexusGenInputs["DeleteCommentInput"]

// Watch later / Playlist / Bookmark
export type PlaylistOrderBy = NexusGenEnums["PlaylistOrderBy"]
export type FetchWatchLaterInput = NexusGenInputs["FetchWatchLaterInput"]
export type AddToWatchLaterInput = NexusGenInputs["AddToWatchLaterInput"]
export type RemoveFromWatchLaterInput =
  NexusGenInputs["RemoveFromWatchLaterInput"]
export type RemoveAllWatchLaterInput =
  NexusGenInputs["RemoveAllWatchLaterInput"]
export type FetchMyPlaylistsInput = NexusGenInputs["FetchMyPlaylistsInput"]
export type CheckPublishPlaylistsInput =
  NexusGenInputs["CheckPublishPlaylistsInput"]
export type FetchPlaylistItemsInput = NexusGenInputs["FetchPlaylistItemsInput"]
export type CreatePlayListInput = NexusGenInputs["CreatePlayListInput"]
export type AddToPlaylistInput = NexusGenInputs["AddToPlaylistInput"]
export type UpdatePlaylistsInput = NexusGenInputs["UpdatePlaylistsInput"]
export type DeletePlaylistInput = NexusGenInputs["DeletePlaylistInput"]
export type UpdatePlaylistNameInput = NexusGenInputs["UpdatePlaylistNameInput"]
export type UpdatePlaylistDescriptionInput =
  NexusGenInputs["UpdatePlaylistDescriptionInput"]
export type RemoveFromPlaylistInput = NexusGenInputs["RemoveFromPlaylistInput"]
export type DisplayedPlaylist = {
  isInPlaylist: boolean | undefined
  list: Maybe<Playlist> | undefined
}
export type FetchBookmarkInput = NexusGenInputs["FetchBookmarkInput"]
export type BookmarkPostInput = NexusGenInputs["BookmarkPostInput"]
export type RemoveAllBookmarksInput = NexusGenInputs["RemoveAllBookmarksInput"]

// Report / DontRecommend
export type ReportReason = NexusGenEnums["ReportReason"]
export type ReportPublishInput = NexusGenInputs["ReportPublishInput"]
export type FetchDontRecommendsInput =
  NexusGenInputs["FetchDontRecommendsInput"]
export type DontRecommendInput = NexusGenInputs["DontRecommendInput"]

// Notification
export type NotificationType = NexusGenEnums["NotificationType"]
export type ReadStatus = NexusGenEnums["ReadStatus"]
export type FetchNotificationsInput = NexusGenInputs["FetchNotificationsInput"]
export type GetUnReadNotificationsInput =
  NexusGenInputs["GetUnReadNotificationsInput"]
export type UpdateNotificationsInput =
  NexusGenInputs["UpdateNotificationsInput"]
