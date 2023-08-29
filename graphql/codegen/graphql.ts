/* eslint-disable */
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /** A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar. */
  DateTime: { input: any; output: any; }
  Json: { input: any; output: any; }
};

export type Account = {
  __typename?: 'Account';
  authUid?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  defaultProfile?: Maybe<Profile>;
  id: Scalars['ID']['output'];
  owner: Scalars['String']['output'];
  profiles: Array<Profile>;
  type: AccountType;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export enum AccountType {
  Traditional = 'TRADITIONAL',
  Wallet = 'WALLET'
}

export type AddToPlaylistInput = {
  accountId: Scalars['String']['input'];
  owner: Scalars['String']['input'];
  playlistId: Scalars['String']['input'];
  profileId: Scalars['String']['input'];
  publishId: Scalars['String']['input'];
};

export type AddToWatchLaterInput = {
  accountId: Scalars['String']['input'];
  owner: Scalars['String']['input'];
  profileId: Scalars['String']['input'];
  publishId: Scalars['String']['input'];
};

export type Blog = {
  __typename?: 'Blog';
  content: Scalars['Json']['output'];
  createdAt: Scalars['DateTime']['output'];
  excerpt?: Maybe<Scalars['String']['output']>;
  htmlContent?: Maybe<Scalars['String']['output']>;
  publish?: Maybe<Publish>;
  publishId: Scalars['String']['output'];
  readingTime?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type Bookmark = {
  __typename?: 'Bookmark';
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  profile: Profile;
  profileId: Scalars['String']['output'];
  publish: Publish;
  publishId: Scalars['String']['output'];
};

export type BookmarkEdge = {
  __typename?: 'BookmarkEdge';
  cursor?: Maybe<Scalars['String']['output']>;
  node?: Maybe<Bookmark>;
};

export type BookmarkPostInput = {
  accountId: Scalars['String']['input'];
  owner: Scalars['String']['input'];
  profileId: Scalars['String']['input'];
  publishId: Scalars['String']['input'];
};

export enum BroadcastType {
  Software = 'software',
  Webcam = 'webcam'
}

export type CacheSessionInput = {
  accountId: Scalars['String']['input'];
  address: Scalars['String']['input'];
  profileId: Scalars['String']['input'];
};

export type CalculateTipsResult = {
  __typename?: 'CalculateTipsResult';
  tips: Scalars['String']['output'];
};

export enum Category {
  Ai = 'AI',
  Animals = 'Animals',
  Blockchain = 'Blockchain',
  Children = 'Children',
  Drinks = 'Drinks',
  Education = 'Education',
  Entertainment = 'Entertainment',
  Food = 'Food',
  Gaming = 'Gaming',
  Health = 'Health',
  History = 'History',
  LifeStyle = 'LifeStyle',
  Men = 'Men',
  Movies = 'Movies',
  Music = 'Music',
  News = 'News',
  Other = 'Other',
  Programming = 'Programming',
  Science = 'Science',
  Sports = 'Sports',
  Technology = 'Technology',
  Travel = 'Travel',
  Vehicles = 'Vehicles',
  Women = 'Women'
}

export type CheckPublishPlaylistsInput = {
  accountId: Scalars['String']['input'];
  owner: Scalars['String']['input'];
  profileId: Scalars['String']['input'];
  publishId: Scalars['String']['input'];
};

export type CheckPublishPlaylistsResponse = {
  __typename?: 'CheckPublishPlaylistsResponse';
  isInWatchLater: Scalars['Boolean']['output'];
  items: Array<PlaylistItem>;
  publishId: Scalars['String']['output'];
};

export type Comment = {
  __typename?: 'Comment';
  comment?: Maybe<Comment>;
  commentId?: Maybe<Scalars['String']['output']>;
  commentType: CommentType;
  comments: Array<Comment>;
  commentsCount: Scalars['Int']['output'];
  content?: Maybe<Scalars['String']['output']>;
  contentBlog?: Maybe<Scalars['Json']['output']>;
  createdAt: Scalars['DateTime']['output'];
  creator: Profile;
  creatorId: Scalars['String']['output'];
  disLiked?: Maybe<Scalars['Boolean']['output']>;
  disLikes: Array<CommentDisLike>;
  disLikesCount: Scalars['Int']['output'];
  htmlContentBlog?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  liked?: Maybe<Scalars['Boolean']['output']>;
  likes: Array<CommentLike>;
  likesCount: Scalars['Int']['output'];
  publish: Publish;
  publishId: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type CommentDisLike = {
  __typename?: 'CommentDisLike';
  comment: Comment;
  commentId: Scalars['String']['output'];
  profile: Profile;
  profileId: Scalars['String']['output'];
};

export type CommentEdge = {
  __typename?: 'CommentEdge';
  cursor?: Maybe<Scalars['String']['output']>;
  node?: Maybe<Comment>;
};

export type CommentLike = {
  __typename?: 'CommentLike';
  comment: Comment;
  commentId: Scalars['String']['output'];
  profile: Profile;
  profileId: Scalars['String']['output'];
};

export type CommentPublishInput = {
  accountId: Scalars['String']['input'];
  commentId?: InputMaybe<Scalars['String']['input']>;
  commentType: CommentType;
  content?: InputMaybe<Scalars['String']['input']>;
  contentBlog?: InputMaybe<Scalars['Json']['input']>;
  htmlContentBlog?: InputMaybe<Scalars['String']['input']>;
  owner: Scalars['String']['input'];
  profileId: Scalars['String']['input'];
  publishId: Scalars['String']['input'];
};

export enum CommentType {
  Comment = 'COMMENT',
  Publish = 'PUBLISH'
}

export enum CommentsOrderBy {
  Counts = 'counts',
  Newest = 'newest'
}

export type CreateDraftBlogInput = {
  accountId: Scalars['String']['input'];
  creatorId: Scalars['String']['input'];
  owner: Scalars['String']['input'];
};

export type CreateDraftBlogResult = {
  __typename?: 'CreateDraftBlogResult';
  id: Scalars['String']['output'];
};

export type CreateDraftVideoInput = {
  accountId: Scalars['String']['input'];
  creatorId: Scalars['String']['input'];
  filename: Scalars['String']['input'];
  owner: Scalars['String']['input'];
};

export type CreateDraftVideoResult = {
  __typename?: 'CreateDraftVideoResult';
  filename?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
};

export type CreateLiveInputMessage = {
  __typename?: 'CreateLiveInputMessage';
  code: Scalars['Int']['output'];
  message: Scalars['String']['output'];
};

export type CreateLiveInputResponse = {
  __typename?: 'CreateLiveInputResponse';
  errors: Array<CreateLiveInputMessage>;
  messages: Array<CreateLiveInputMessage>;
  result: CreateLiveInputResult;
  success: Scalars['Boolean']['output'];
};

export type CreateLiveInputResult = {
  __typename?: 'CreateLiveInputResult';
  rtmps: Rtmps;
  rtmpsPlayback: Rtmps;
  srt: Srt;
  srtPlayback: Srt;
  status?: Maybe<LiveStatus>;
  uid: Scalars['String']['output'];
  webRTC: WebRtc;
  webRTCPlayback: WebRtc;
};

export type CreatePlayListInput = {
  accountId: Scalars['String']['input'];
  name: Scalars['String']['input'];
  owner: Scalars['String']['input'];
  profileId: Scalars['String']['input'];
  publishId: Scalars['String']['input'];
};

export type CreateProfileInput = {
  accountId: Scalars['String']['input'];
  name: Scalars['String']['input'];
  owner: Scalars['String']['input'];
};

export type DeleteCommentInput = {
  accountId: Scalars['String']['input'];
  commentId: Scalars['String']['input'];
  owner: Scalars['String']['input'];
  profileId: Scalars['String']['input'];
};

export type DeletePlaylistInput = {
  accountId: Scalars['String']['input'];
  owner: Scalars['String']['input'];
  playlistId: Scalars['String']['input'];
  profileId: Scalars['String']['input'];
};

export type DeletePublishInput = {
  accountId: Scalars['String']['input'];
  creatorId: Scalars['String']['input'];
  owner: Scalars['String']['input'];
  publishId: Scalars['String']['input'];
};

export type DisLike = {
  __typename?: 'DisLike';
  createdAt: Scalars['DateTime']['output'];
  profile: Profile;
  profileId: Scalars['String']['output'];
  publish: Publish;
  publishId: Scalars['String']['output'];
};

export type DontRecommend = {
  __typename?: 'DontRecommend';
  createdAt: Scalars['DateTime']['output'];
  requestorId: Scalars['String']['output'];
  target: Profile;
  targetId: Scalars['String']['output'];
};

export type DontRecommendEdge = {
  __typename?: 'DontRecommendEdge';
  cursor?: Maybe<Scalars['String']['output']>;
  node?: Maybe<DontRecommend>;
};

export type DontRecommendInput = {
  accountId: Scalars['String']['input'];
  owner: Scalars['String']['input'];
  profileId: Scalars['String']['input'];
  targetId: Scalars['String']['input'];
};

export type FetchBookmarkInput = {
  accountId: Scalars['String']['input'];
  cursor?: InputMaybe<Scalars['String']['input']>;
  orderBy?: InputMaybe<PlaylistOrderBy>;
  owner: Scalars['String']['input'];
  profileId: Scalars['String']['input'];
};

export type FetchBookmarkResponse = {
  __typename?: 'FetchBookmarkResponse';
  edges: Array<BookmarkEdge>;
  pageInfo: PageInfo;
};

export type FetchCommentsByPublishIdInput = {
  cursor?: InputMaybe<Scalars['String']['input']>;
  orderBy?: InputMaybe<CommentsOrderBy>;
  publishId: Scalars['String']['input'];
  requestorId?: InputMaybe<Scalars['String']['input']>;
};

export type FetchCommentsResponse = {
  __typename?: 'FetchCommentsResponse';
  edges: Array<CommentEdge>;
  pageInfo: PageInfo;
};

export type FetchDontRecommendsInput = {
  accountId: Scalars['String']['input'];
  cursor?: InputMaybe<Scalars['String']['input']>;
  owner: Scalars['String']['input'];
  requestorId: Scalars['String']['input'];
};

export type FetchDontRecommendsResponse = {
  __typename?: 'FetchDontRecommendsResponse';
  edges: Array<DontRecommendEdge>;
  pageInfo: PageInfo;
};

export type FetchFollowsInput = {
  accountId: Scalars['String']['input'];
  cursor?: InputMaybe<Scalars['String']['input']>;
  owner: Scalars['String']['input'];
  requestorId: Scalars['String']['input'];
};

export type FetchFollowsResponse = {
  __typename?: 'FetchFollowsResponse';
  edges: Array<FollowEdge>;
  pageInfo: PageInfo;
};

export type FetchMyPlaylistsInput = {
  accountId: Scalars['String']['input'];
  cursor?: InputMaybe<Scalars['String']['input']>;
  owner: Scalars['String']['input'];
  profileId: Scalars['String']['input'];
};

export type FetchMyPublishesInput = {
  accountId: Scalars['String']['input'];
  creatorId: Scalars['String']['input'];
  cursor?: InputMaybe<Scalars['String']['input']>;
  owner: Scalars['String']['input'];
  publishType?: InputMaybe<QueryPublishType>;
};

export type FetchNotificationsInput = {
  accountId: Scalars['String']['input'];
  cursor?: InputMaybe<Scalars['String']['input']>;
  owner: Scalars['String']['input'];
  profileId: Scalars['String']['input'];
};

export type FetchNotificationsResponse = {
  __typename?: 'FetchNotificationsResponse';
  edges: Array<NotificationEdge>;
  pageInfo: PageInfo;
};

export type FetchPlaylistItemsInput = {
  accountId: Scalars['String']['input'];
  cursor?: InputMaybe<Scalars['String']['input']>;
  orderBy?: InputMaybe<PlaylistOrderBy>;
  owner: Scalars['String']['input'];
  playlistId: Scalars['String']['input'];
  profileId: Scalars['String']['input'];
};

export type FetchPlaylistItemsResponse = {
  __typename?: 'FetchPlaylistItemsResponse';
  edges: Array<PlaylistItemEdge>;
  pageInfo: PageInfo;
  playlistDescription?: Maybe<Scalars['String']['output']>;
  playlistName: Scalars['String']['output'];
};

export type FetchPlaylistsResponse = {
  __typename?: 'FetchPlaylistsResponse';
  edges: Array<PlaylistEdge>;
  pageInfo: PageInfo;
};

export type FetchPreviewPlaylistsResponse = {
  __typename?: 'FetchPreviewPlaylistsResponse';
  edges: Array<PreviewPlaylistEdge>;
  pageInfo: PageInfo;
};

export type FetchPublishesByCatInput = {
  category: Category;
  cursor?: InputMaybe<Scalars['String']['input']>;
  requestorId?: InputMaybe<Scalars['String']['input']>;
};

export type FetchPublishesByProfileInput = {
  creatorId: Scalars['String']['input'];
  cursor?: InputMaybe<Scalars['String']['input']>;
  orderBy?: InputMaybe<PublishOrderBy>;
  publishType?: InputMaybe<QueryPublishType>;
  requestorId?: InputMaybe<Scalars['String']['input']>;
};

export type FetchPublishesByQueryStringInput = {
  cursor?: InputMaybe<Scalars['String']['input']>;
  publishType?: InputMaybe<QueryPublishType>;
  query: Scalars['String']['input'];
  requestorId?: InputMaybe<Scalars['String']['input']>;
};

export type FetchPublishesByTagInput = {
  cursor?: InputMaybe<Scalars['String']['input']>;
  publishType?: InputMaybe<QueryPublishType>;
  requestorId?: InputMaybe<Scalars['String']['input']>;
  tag: Scalars['String']['input'];
};

export type FetchPublishesInput = {
  cursor?: InputMaybe<Scalars['String']['input']>;
  orderBy?: InputMaybe<PublishOrderBy>;
  publishType?: InputMaybe<QueryPublishType>;
  requestorId?: InputMaybe<Scalars['String']['input']>;
};

export type FetchPublishesResponse = {
  __typename?: 'FetchPublishesResponse';
  edges: Array<PublishEdge>;
  pageInfo: PageInfo;
};

export type FetchSubCommentsInput = {
  commentId: Scalars['String']['input'];
  cursor?: InputMaybe<Scalars['String']['input']>;
  requestorId?: InputMaybe<Scalars['String']['input']>;
};

export type FetchSuggestedPublishesInput = {
  cursor?: InputMaybe<Scalars['String']['input']>;
  publishId: Scalars['String']['input'];
  requestorId?: InputMaybe<Scalars['String']['input']>;
};

export type FetchWatchLaterInput = {
  accountId: Scalars['String']['input'];
  cursor?: InputMaybe<Scalars['String']['input']>;
  orderBy?: InputMaybe<PlaylistOrderBy>;
  owner: Scalars['String']['input'];
  profileId: Scalars['String']['input'];
};

export type FetchWatchLaterResponse = {
  __typename?: 'FetchWatchLaterResponse';
  edges: Array<WatchLaterEdge>;
  pageInfo: PageInfo;
};

export type Follow = {
  __typename?: 'Follow';
  follower: Profile;
  followerId: Scalars['String']['output'];
  following: Profile;
  followingId: Scalars['String']['output'];
  id: Scalars['String']['output'];
};

export type FollowEdge = {
  __typename?: 'FollowEdge';
  cursor?: Maybe<Scalars['String']['output']>;
  node?: Maybe<Follow>;
};

export type FollowInput = {
  accountId: Scalars['String']['input'];
  followerId: Scalars['String']['input'];
  owner: Scalars['String']['input'];
  profileId: Scalars['String']['input'];
};

export type GetLiveStreamPublishInput = {
  accountId: Scalars['String']['input'];
  owner: Scalars['String']['input'];
  profileId: Scalars['String']['input'];
  publishId: Scalars['String']['input'];
};

export type GetLiveStreamPublishRespnse = {
  __typename?: 'GetLiveStreamPublishRespnse';
  liveInput?: Maybe<CreateLiveInputResponse>;
  publish?: Maybe<Publish>;
};

export type GetMyAccountInput = {
  accountType: AccountType;
};

export type GetUnReadNotificationsInput = {
  accountId: Scalars['String']['input'];
  owner: Scalars['String']['input'];
  profileId: Scalars['String']['input'];
};

export type GetUnReadNotificationsResponse = {
  __typename?: 'GetUnReadNotificationsResponse';
  unread: Scalars['Int']['output'];
};

export type Like = {
  __typename?: 'Like';
  createdAt: Scalars['DateTime']['output'];
  profile: Profile;
  profileId: Scalars['String']['output'];
  publish: Publish;
  publishId: Scalars['String']['output'];
};

export type LikeCommentInput = {
  accountId: Scalars['String']['input'];
  commentId: Scalars['String']['input'];
  owner: Scalars['String']['input'];
  profileId: Scalars['String']['input'];
  publishId: Scalars['String']['input'];
};

export type LikePublishInput = {
  accountId: Scalars['String']['input'];
  owner: Scalars['String']['input'];
  profileId: Scalars['String']['input'];
  publishId: Scalars['String']['input'];
};

export enum LiveStatus {
  Inprogress = 'inprogress',
  Ready = 'ready'
}

export type Mutation = {
  __typename?: 'Mutation';
  addToNewPlaylist?: Maybe<WriteResult>;
  addToPlaylist?: Maybe<WriteResult>;
  addToWatchLater?: Maybe<WriteResult>;
  bookmarkPost?: Maybe<WriteResult>;
  cacheSession: WriteResult;
  calculateTips?: Maybe<CalculateTipsResult>;
  comment?: Maybe<WriteResult>;
  countViews?: Maybe<WriteResult>;
  createAccount?: Maybe<Account>;
  createDraftBlog?: Maybe<CreateDraftBlogResult>;
  createDraftVideo?: Maybe<CreateDraftVideoResult>;
  createProfile?: Maybe<Profile>;
  deleteAllPlaylistItems?: Maybe<WriteResult>;
  deleteComment?: Maybe<WriteResult>;
  deletePlaylist?: Maybe<WriteResult>;
  deletePublish?: Maybe<WriteResult>;
  disLikeComment?: Maybe<WriteResult>;
  disLikePublish?: Maybe<WriteResult>;
  dontRecommend?: Maybe<WriteResult>;
  follow?: Maybe<WriteResult>;
  likeComment?: Maybe<WriteResult>;
  likePublish?: Maybe<WriteResult>;
  removeAllBookmarks?: Maybe<WriteResult>;
  removeAllWatchLater?: Maybe<WriteResult>;
  removeBookmark?: Maybe<WriteResult>;
  removeDontRecommend?: Maybe<WriteResult>;
  removeFromPlaylist?: Maybe<WriteResult>;
  removeFromWatchLater?: Maybe<WriteResult>;
  reportPublish?: Maybe<WriteResult>;
  requestLiveStream?: Maybe<RequestLiveStreamResult>;
  sendTips?: Maybe<SendTipsResult>;
  updateBannerImage?: Maybe<WriteResult>;
  updateBlog?: Maybe<WriteResult>;
  updateDisplayName?: Maybe<WriteResult>;
  updateName?: Maybe<WriteResult>;
  updateNotificationsStatus?: Maybe<WriteResult>;
  updatePlaylistDescription?: Maybe<WriteResult>;
  updatePlaylistName?: Maybe<WriteResult>;
  updatePlaylists?: Maybe<WriteResult>;
  updateProfileImage?: Maybe<WriteResult>;
  updateReadPreferences?: Maybe<WriteResult>;
  updateVideo?: Maybe<Publish>;
  updateWatchPreferences?: Maybe<WriteResult>;
  validateAuth?: Maybe<ValidateAuthResult>;
  validateName?: Maybe<Scalars['Boolean']['output']>;
};


export type MutationAddToNewPlaylistArgs = {
  input: CreatePlayListInput;
};


export type MutationAddToPlaylistArgs = {
  input: AddToPlaylistInput;
};


export type MutationAddToWatchLaterArgs = {
  input: AddToWatchLaterInput;
};


export type MutationBookmarkPostArgs = {
  input: BookmarkPostInput;
};


export type MutationCacheSessionArgs = {
  input: CacheSessionInput;
};


export type MutationCalculateTipsArgs = {
  qty: Scalars['Int']['input'];
};


export type MutationCommentArgs = {
  input: CommentPublishInput;
};


export type MutationCountViewsArgs = {
  publishId: Scalars['String']['input'];
};


export type MutationCreateAccountArgs = {
  input: GetMyAccountInput;
};


export type MutationCreateDraftBlogArgs = {
  input: CreateDraftBlogInput;
};


export type MutationCreateDraftVideoArgs = {
  input: CreateDraftVideoInput;
};


export type MutationCreateProfileArgs = {
  input: CreateProfileInput;
};


export type MutationDeleteAllPlaylistItemsArgs = {
  input: DeletePlaylistInput;
};


export type MutationDeleteCommentArgs = {
  input: DeleteCommentInput;
};


export type MutationDeletePlaylistArgs = {
  input: DeletePlaylistInput;
};


export type MutationDeletePublishArgs = {
  input: DeletePublishInput;
};


export type MutationDisLikeCommentArgs = {
  input: LikeCommentInput;
};


export type MutationDisLikePublishArgs = {
  input: LikePublishInput;
};


export type MutationDontRecommendArgs = {
  input: DontRecommendInput;
};


export type MutationFollowArgs = {
  input: FollowInput;
};


export type MutationLikeCommentArgs = {
  input: LikeCommentInput;
};


export type MutationLikePublishArgs = {
  input: LikePublishInput;
};


export type MutationRemoveAllBookmarksArgs = {
  input: RemoveAllBookmarksInput;
};


export type MutationRemoveAllWatchLaterArgs = {
  input: RemoveAllWatchLaterInput;
};


export type MutationRemoveBookmarkArgs = {
  input: BookmarkPostInput;
};


export type MutationRemoveDontRecommendArgs = {
  input: DontRecommendInput;
};


export type MutationRemoveFromPlaylistArgs = {
  input: RemoveFromPlaylistInput;
};


export type MutationRemoveFromWatchLaterArgs = {
  input: RemoveFromWatchLaterInput;
};


export type MutationReportPublishArgs = {
  input: ReportPublishInput;
};


export type MutationRequestLiveStreamArgs = {
  input: RequestLiveStreamInput;
};


export type MutationSendTipsArgs = {
  input: SendTipsInput;
};


export type MutationUpdateBannerImageArgs = {
  input: UpdateImageInput;
};


export type MutationUpdateBlogArgs = {
  input: UpdateBlogInput;
};


export type MutationUpdateDisplayNameArgs = {
  input: UpdateNameInput;
};


export type MutationUpdateNameArgs = {
  input: UpdateNameInput;
};


export type MutationUpdateNotificationsStatusArgs = {
  input: UpdateNotificationsInput;
};


export type MutationUpdatePlaylistDescriptionArgs = {
  input: UpdatePlaylistDescriptionInput;
};


export type MutationUpdatePlaylistNameArgs = {
  input: UpdatePlaylistNameInput;
};


export type MutationUpdatePlaylistsArgs = {
  input: UpdatePlaylistsInput;
};


export type MutationUpdateProfileImageArgs = {
  input: UpdateImageInput;
};


export type MutationUpdateReadPreferencesArgs = {
  input: UpdatePreferencesInput;
};


export type MutationUpdateVideoArgs = {
  input: UpdateVideoInput;
};


export type MutationUpdateWatchPreferencesArgs = {
  input: UpdatePreferencesInput;
};


export type MutationValidateAuthArgs = {
  input: ValidateAuthInput;
};


export type MutationValidateNameArgs = {
  name: Scalars['String']['input'];
};

export type Notification = {
  __typename?: 'Notification';
  content: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  profile: Profile;
  profileId: Scalars['String']['output'];
  receiver: Profile;
  receiverId: Scalars['String']['output'];
  status: ReadStatus;
};

export type NotificationEdge = {
  __typename?: 'NotificationEdge';
  cursor?: Maybe<Scalars['String']['output']>;
  node?: Maybe<Notification>;
};

export enum NotificationType {
  Comment = 'COMMENT',
  Follow = 'FOLLOW',
  Like = 'LIKE',
  NewRelease = 'NEW_RELEASE',
  Other = 'OTHER',
  Tip = 'TIP'
}

export type PageInfo = {
  __typename?: 'PageInfo';
  count?: Maybe<Scalars['Int']['output']>;
  endCursor?: Maybe<Scalars['String']['output']>;
  hasNextPage?: Maybe<Scalars['Boolean']['output']>;
};

export type Playback = {
  __typename?: 'Playback';
  createdAt: Scalars['DateTime']['output'];
  dash: Scalars['String']['output'];
  duration: Scalars['Float']['output'];
  hls: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  liveStatus?: Maybe<LiveStatus>;
  preview: Scalars['String']['output'];
  publish?: Maybe<Publish>;
  publishId: Scalars['String']['output'];
  thumbnail: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  videoId: Scalars['String']['output'];
};

export type Playlist = {
  __typename?: 'Playlist';
  createdAt: Scalars['DateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  items: Array<PlaylistItem>;
  name: Scalars['String']['output'];
  owner: Profile;
  ownerId: Scalars['String']['output'];
};

export type PlaylistEdge = {
  __typename?: 'PlaylistEdge';
  cursor?: Maybe<Scalars['String']['output']>;
  node?: Maybe<Playlist>;
};

export type PlaylistItem = {
  __typename?: 'PlaylistItem';
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  playlist: Playlist;
  playlistId: Scalars['String']['output'];
  publish: Publish;
  publishId: Scalars['String']['output'];
};

export type PlaylistItemEdge = {
  __typename?: 'PlaylistItemEdge';
  cursor?: Maybe<Scalars['String']['output']>;
  node?: Maybe<PlaylistItem>;
};

export type PlaylistItemStatus = {
  isInPlaylist: Scalars['Boolean']['input'];
  playlistId: Scalars['String']['input'];
};

export enum PlaylistOrderBy {
  Newest = 'newest',
  Oldest = 'oldest'
}

export type PreviewPlaylist = {
  __typename?: 'PreviewPlaylist';
  count: Scalars['Int']['output'];
  id: Scalars['String']['output'];
  lastItem?: Maybe<Publish>;
  name: Scalars['String']['output'];
};

export type PreviewPlaylistEdge = {
  __typename?: 'PreviewPlaylistEdge';
  cursor?: Maybe<Scalars['String']['output']>;
  node?: Maybe<PreviewPlaylist>;
};

export type Profile = {
  __typename?: 'Profile';
  account: Account;
  accountId: Scalars['String']['output'];
  bannerImage?: Maybe<Scalars['String']['output']>;
  bannerImageRef?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  defaultColor?: Maybe<Scalars['String']['output']>;
  displayName: Scalars['String']['output'];
  followersCount: Scalars['Int']['output'];
  followingCount: Scalars['Int']['output'];
  id: Scalars['ID']['output'];
  image?: Maybe<Scalars['String']['output']>;
  imageRef?: Maybe<Scalars['String']['output']>;
  isFollowing?: Maybe<Scalars['Boolean']['output']>;
  isOwner?: Maybe<Scalars['Boolean']['output']>;
  name: Scalars['String']['output'];
  owner: Scalars['String']['output'];
  playlists: Array<Playlist>;
  publishes: Array<Publish>;
  publishesCount: Scalars['Int']['output'];
  readPreferences: Array<Category>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  watchLater: Array<WatchLater>;
  watchPreferences: Array<Category>;
};

export type Publish = {
  __typename?: 'Publish';
  blog?: Maybe<Blog>;
  bookmarked?: Maybe<Scalars['Boolean']['output']>;
  broadcastType?: Maybe<BroadcastType>;
  comments: Array<Comment>;
  commentsCount: Scalars['Int']['output'];
  contentRef?: Maybe<Scalars['String']['output']>;
  contentURI?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  creator: Profile;
  creatorId: Scalars['String']['output'];
  deleting: Scalars['Boolean']['output'];
  description?: Maybe<Scalars['String']['output']>;
  disLiked?: Maybe<Scalars['Boolean']['output']>;
  disLikesCount: Scalars['Int']['output'];
  dislikes: Array<DisLike>;
  filename?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  lastComment?: Maybe<Comment>;
  liked?: Maybe<Scalars['Boolean']['output']>;
  likes: Array<Like>;
  likesCount: Scalars['Int']['output'];
  liveInputUID?: Maybe<Scalars['String']['output']>;
  playback?: Maybe<Playback>;
  primaryCategory?: Maybe<Category>;
  publishType?: Maybe<PublishType>;
  secondaryCategory?: Maybe<Category>;
  streamType: StreamType;
  tags?: Maybe<Scalars['String']['output']>;
  thumbnail?: Maybe<Scalars['String']['output']>;
  thumbnailRef?: Maybe<Scalars['String']['output']>;
  thumbnailType: ThumbnailType;
  tips: Array<Tip>;
  tipsCount: Scalars['Int']['output'];
  title?: Maybe<Scalars['String']['output']>;
  transcodeError: Scalars['Boolean']['output'];
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  uploadError: Scalars['Boolean']['output'];
  uploading: Scalars['Boolean']['output'];
  views: Scalars['Int']['output'];
  visibility: Visibility;
};

export type PublishEdge = {
  __typename?: 'PublishEdge';
  cursor?: Maybe<Scalars['String']['output']>;
  node?: Maybe<Publish>;
};

export enum PublishOrderBy {
  Latest = 'latest',
  Popular = 'popular'
}

export enum PublishType {
  Ads = 'Ads',
  Blog = 'Blog',
  Podcast = 'Podcast',
  Short = 'Short',
  Video = 'Video'
}

export type Query = {
  __typename?: 'Query';
  checkPublishPlaylists?: Maybe<CheckPublishPlaylistsResponse>;
  fetchBookmarks?: Maybe<FetchBookmarkResponse>;
  fetchCommentsByPublishId?: Maybe<FetchCommentsResponse>;
  fetchDontRecommends?: Maybe<FetchDontRecommendsResponse>;
  fetchMyFollowers?: Maybe<FetchFollowsResponse>;
  fetchMyFollowing?: Maybe<FetchFollowsResponse>;
  fetchMyLiveStream?: Maybe<FetchPublishesResponse>;
  fetchMyNotifications?: Maybe<FetchNotificationsResponse>;
  fetchMyPlaylists?: Maybe<FetchPlaylistsResponse>;
  fetchMyPublishes?: Maybe<FetchPublishesResponse>;
  fetchPlaylistItems?: Maybe<FetchPlaylistItemsResponse>;
  fetchPreviewBookmarks?: Maybe<FetchBookmarkResponse>;
  fetchPreviewPlaylists?: Maybe<FetchPreviewPlaylistsResponse>;
  fetchPreviewWatchLater?: Maybe<FetchWatchLaterResponse>;
  fetchProfilePublishes?: Maybe<FetchPublishesResponse>;
  fetchPublishes?: Maybe<FetchPublishesResponse>;
  fetchPublishesByQueryString?: Maybe<FetchPublishesResponse>;
  fetchPublishesByTag?: Maybe<FetchPublishesResponse>;
  fetchSubComments?: Maybe<FetchCommentsResponse>;
  fetchSuggestedBlogs?: Maybe<FetchPublishesResponse>;
  fetchSuggestedVideos?: Maybe<FetchPublishesResponse>;
  fetchVideosByCategory?: Maybe<FetchPublishesResponse>;
  fetchWatchLater?: Maybe<FetchWatchLaterResponse>;
  getBalance: Scalars['String']['output'];
  getLiveStreamPublish?: Maybe<GetLiveStreamPublishRespnse>;
  getMyAccount?: Maybe<Account>;
  getProfileById?: Maybe<Profile>;
  getProfileByName?: Maybe<Profile>;
  getPublishById?: Maybe<Publish>;
  getShort?: Maybe<Publish>;
  getUnReadNotifications?: Maybe<GetUnReadNotificationsResponse>;
};


export type QueryCheckPublishPlaylistsArgs = {
  input: CheckPublishPlaylistsInput;
};


export type QueryFetchBookmarksArgs = {
  input: FetchBookmarkInput;
};


export type QueryFetchCommentsByPublishIdArgs = {
  input: FetchCommentsByPublishIdInput;
};


export type QueryFetchDontRecommendsArgs = {
  input: FetchDontRecommendsInput;
};


export type QueryFetchMyFollowersArgs = {
  input: FetchFollowsInput;
};


export type QueryFetchMyFollowingArgs = {
  input: FetchFollowsInput;
};


export type QueryFetchMyLiveStreamArgs = {
  input: FetchMyPublishesInput;
};


export type QueryFetchMyNotificationsArgs = {
  input: FetchNotificationsInput;
};


export type QueryFetchMyPlaylistsArgs = {
  input: FetchMyPlaylistsInput;
};


export type QueryFetchMyPublishesArgs = {
  input: FetchMyPublishesInput;
};


export type QueryFetchPlaylistItemsArgs = {
  input: FetchPlaylistItemsInput;
};


export type QueryFetchPreviewBookmarksArgs = {
  input: FetchBookmarkInput;
};


export type QueryFetchPreviewPlaylistsArgs = {
  input: FetchMyPlaylistsInput;
};


export type QueryFetchPreviewWatchLaterArgs = {
  input: FetchWatchLaterInput;
};


export type QueryFetchProfilePublishesArgs = {
  input: FetchPublishesByProfileInput;
};


export type QueryFetchPublishesArgs = {
  input: FetchPublishesInput;
};


export type QueryFetchPublishesByQueryStringArgs = {
  input: FetchPublishesByQueryStringInput;
};


export type QueryFetchPublishesByTagArgs = {
  input: FetchPublishesByTagInput;
};


export type QueryFetchSubCommentsArgs = {
  input: FetchSubCommentsInput;
};


export type QueryFetchSuggestedBlogsArgs = {
  input: FetchSuggestedPublishesInput;
};


export type QueryFetchSuggestedVideosArgs = {
  input: FetchSuggestedPublishesInput;
};


export type QueryFetchVideosByCategoryArgs = {
  input: FetchPublishesByCatInput;
};


export type QueryFetchWatchLaterArgs = {
  input: FetchWatchLaterInput;
};


export type QueryGetBalanceArgs = {
  address: Scalars['String']['input'];
};


export type QueryGetLiveStreamPublishArgs = {
  input: GetLiveStreamPublishInput;
};


export type QueryGetMyAccountArgs = {
  input: GetMyAccountInput;
};


export type QueryGetProfileByIdArgs = {
  input: QueryByIdInput;
};


export type QueryGetProfileByNameArgs = {
  input: QueryByNameInput;
};


export type QueryGetPublishByIdArgs = {
  input: QueryByIdInput;
};


export type QueryGetShortArgs = {
  input: QueryByIdInput;
};


export type QueryGetUnReadNotificationsArgs = {
  input: GetUnReadNotificationsInput;
};

export type QueryByIdInput = {
  requestorId?: InputMaybe<Scalars['String']['input']>;
  targetId: Scalars['String']['input'];
};

export type QueryByNameInput = {
  name: Scalars['String']['input'];
  requestorId?: InputMaybe<Scalars['String']['input']>;
};

export enum QueryPublishType {
  Ads = 'ads',
  All = 'all',
  Blogs = 'blogs',
  Shorts = 'shorts',
  Videos = 'videos'
}

export type Rtmps = {
  __typename?: 'RTMPS';
  streamKey: Scalars['String']['output'];
  url: Scalars['String']['output'];
};

export enum ReadStatus {
  Read = 'read',
  Unread = 'unread'
}

export type RemoveAllBookmarksInput = {
  accountId: Scalars['String']['input'];
  owner: Scalars['String']['input'];
  profileId: Scalars['String']['input'];
};

export type RemoveAllWatchLaterInput = {
  accountId: Scalars['String']['input'];
  owner: Scalars['String']['input'];
  profileId: Scalars['String']['input'];
};

export type RemoveFromPlaylistInput = {
  accountId: Scalars['String']['input'];
  owner: Scalars['String']['input'];
  playlistId: Scalars['String']['input'];
  profileId: Scalars['String']['input'];
  publishId: Scalars['String']['input'];
};

export type RemoveFromWatchLaterInput = {
  accountId: Scalars['String']['input'];
  id?: InputMaybe<Scalars['String']['input']>;
  owner: Scalars['String']['input'];
  profileId: Scalars['String']['input'];
  publishId: Scalars['String']['input'];
};

export type Report = {
  __typename?: 'Report';
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  publish: Publish;
  publishId: Scalars['String']['output'];
  reason: ReportReason;
  submittedBy: Profile;
  submittedById: Scalars['String']['output'];
};

export type ReportPublishInput = {
  accountId: Scalars['String']['input'];
  owner: Scalars['String']['input'];
  profileId: Scalars['String']['input'];
  publishId: Scalars['String']['input'];
  reason: ReportReason;
};

export enum ReportReason {
  Abuse = 'abuse',
  Adult = 'adult',
  Harass = 'harass',
  Harmful = 'harmful',
  Hateful = 'hateful',
  Mislead = 'mislead',
  Spam = 'spam',
  Terrorism = 'terrorism',
  Violent = 'violent'
}

export type RequestLiveStreamInput = {
  accountId: Scalars['String']['input'];
  broadcastType: BroadcastType;
  description?: InputMaybe<Scalars['String']['input']>;
  owner: Scalars['String']['input'];
  primaryCategory: Category;
  profileId: Scalars['String']['input'];
  secondaryCategory?: InputMaybe<Category>;
  tags?: InputMaybe<Scalars['String']['input']>;
  thumbnail?: InputMaybe<Scalars['String']['input']>;
  thumbnailRef?: InputMaybe<Scalars['String']['input']>;
  title: Scalars['String']['input'];
  visibility: Visibility;
};

export type RequestLiveStreamResult = {
  __typename?: 'RequestLiveStreamResult';
  id: Scalars['String']['output'];
};

export type Srt = {
  __typename?: 'SRT';
  passphrase: Scalars['String']['output'];
  streamId: Scalars['String']['output'];
  url: Scalars['String']['output'];
};

export type SendTipsInput = {
  accountId: Scalars['String']['input'];
  owner: Scalars['String']['input'];
  profileId: Scalars['String']['input'];
  publishId: Scalars['String']['input'];
  qty: Scalars['Int']['input'];
  receiverId: Scalars['String']['input'];
};

export type SendTipsResult = {
  __typename?: 'SendTipsResult';
  amount: Scalars['String']['output'];
  fee: Scalars['String']['output'];
  from: Scalars['String']['output'];
  to: Scalars['String']['output'];
};

export enum StreamType {
  Live = 'Live',
  OnDemand = 'onDemand'
}

export enum ThumbnailType {
  Custom = 'custom',
  Generated = 'generated'
}

export type Tip = {
  __typename?: 'Tip';
  amount: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  fee: Scalars['String']['output'];
  from: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  publish: Publish;
  publishId: Scalars['String']['output'];
  receiver: Profile;
  receiverId: Scalars['String']['output'];
  sender: Profile;
  senderId: Scalars['String']['output'];
  to: Scalars['String']['output'];
};

export type UpdateBlogInput = {
  accountId: Scalars['String']['input'];
  content?: InputMaybe<Scalars['Json']['input']>;
  creatorId: Scalars['String']['input'];
  filename?: InputMaybe<Scalars['String']['input']>;
  htmlContent?: InputMaybe<Scalars['String']['input']>;
  imageRef?: InputMaybe<Scalars['String']['input']>;
  imageUrl?: InputMaybe<Scalars['String']['input']>;
  owner: Scalars['String']['input'];
  preview?: InputMaybe<Scalars['String']['input']>;
  primaryCategory?: InputMaybe<Category>;
  publishId: Scalars['String']['input'];
  secondaryCategory?: InputMaybe<Category>;
  tags?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  visibility?: InputMaybe<Visibility>;
};

export type UpdateImageInput = {
  accountId: Scalars['String']['input'];
  image: Scalars['String']['input'];
  imageRef: Scalars['String']['input'];
  owner: Scalars['String']['input'];
  profileId: Scalars['String']['input'];
};

export type UpdateNameInput = {
  accountId: Scalars['String']['input'];
  newName: Scalars['String']['input'];
  owner: Scalars['String']['input'];
  profileId: Scalars['String']['input'];
};

export type UpdateNotificationsInput = {
  accountId: Scalars['String']['input'];
  ids: Array<Scalars['String']['input']>;
  owner: Scalars['String']['input'];
  profileId: Scalars['String']['input'];
};

export type UpdatePlaylistDescriptionInput = {
  accountId: Scalars['String']['input'];
  description: Scalars['String']['input'];
  owner: Scalars['String']['input'];
  playlistId: Scalars['String']['input'];
  profileId: Scalars['String']['input'];
};

export type UpdatePlaylistNameInput = {
  accountId: Scalars['String']['input'];
  name: Scalars['String']['input'];
  owner: Scalars['String']['input'];
  playlistId: Scalars['String']['input'];
  profileId: Scalars['String']['input'];
};

export type UpdatePlaylistsInput = {
  accountId: Scalars['String']['input'];
  owner: Scalars['String']['input'];
  playlists: Array<PlaylistItemStatus>;
  profileId: Scalars['String']['input'];
  publishId: Scalars['String']['input'];
};

export type UpdatePreferencesInput = {
  accountId: Scalars['String']['input'];
  owner: Scalars['String']['input'];
  preferences: Array<Category>;
  profileId: Scalars['String']['input'];
};

export type UpdateVideoInput = {
  accountId: Scalars['String']['input'];
  broadcastType?: InputMaybe<BroadcastType>;
  contentRef?: InputMaybe<Scalars['String']['input']>;
  contentURI?: InputMaybe<Scalars['String']['input']>;
  creatorId: Scalars['String']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  owner: Scalars['String']['input'];
  primaryCategory?: InputMaybe<Category>;
  publishId: Scalars['String']['input'];
  secondaryCategory?: InputMaybe<Category>;
  tags?: InputMaybe<Scalars['String']['input']>;
  thumbnail?: InputMaybe<Scalars['String']['input']>;
  thumbnailRef?: InputMaybe<Scalars['String']['input']>;
  thumbnailType: ThumbnailType;
  title?: InputMaybe<Scalars['String']['input']>;
  visibility?: InputMaybe<Visibility>;
};

export type ValidateAuthInput = {
  accountId: Scalars['String']['input'];
  owner: Scalars['String']['input'];
  profileId: Scalars['String']['input'];
};

export type ValidateAuthResult = {
  __typename?: 'ValidateAuthResult';
  isAuthenticated: Scalars['Boolean']['output'];
};

export enum Visibility {
  Draft = 'draft',
  Private = 'private',
  Public = 'public'
}

export type WatchLater = {
  __typename?: 'WatchLater';
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  profile: Profile;
  profileId: Scalars['String']['output'];
  publish: Publish;
  publishId: Scalars['String']['output'];
};

export type WatchLaterEdge = {
  __typename?: 'WatchLaterEdge';
  cursor?: Maybe<Scalars['String']['output']>;
  node?: Maybe<WatchLater>;
};

export type WebRtc = {
  __typename?: 'WebRTC';
  url: Scalars['String']['output'];
};

export type WriteResult = {
  __typename?: 'WriteResult';
  status: Scalars['String']['output'];
};
