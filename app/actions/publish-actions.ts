"use server"

import { revalidatePath } from "next/cache"

import {
  updateVideo,
  updateBlog,
  like,
  disLike,
  commentPublish,
  likeComment,
  disLikeComment,
  report,
  countViews,
  deleteComment,
  bookmark,
  removeAllBookmarks,
  removeBookmark,
} from "@/graphql"
import { getAccount } from "@/lib/server"
import type {
  CommentPublishInput,
  ReportReason,
  UpdateBlogInput,
  UpdateVideoInput,
} from "@/graphql/types"

export async function saveVideo(
  input: Omit<UpdateVideoInput, "accountId" | "owner" | "creatorId">
) {
  try {
    const data = await getAccount()
    const account = data?.account
    const idToken = data?.idToken
    const signature = data?.signature
    const profile = account?.defaultProfile
    if (!account || !profile || !idToken)
      throw new Error("Please sign in to proceed.")

    const {
      publishId,
      thumbnail,
      thumbnailRef,
      thumbnailType,
      title,
      description,
      primaryCategory,
      secondaryCategory,
      visibility,
      tags,
      broadcastType,
    } = input

    await updateVideo({
      idToken,
      signature,
      input: {
        accountId: account.id,
        owner: account.owner,
        creatorId: profile.id,
        publishId,
        thumbnail: thumbnail || null,
        thumbnailRef: thumbnailRef || null,
        thumbnailType: thumbnailType || null,
        title: title || null,
        description: description || null,
        primaryCategory: primaryCategory || null,
        secondaryCategory: secondaryCategory || null,
        visibility,
        tags: tags || null,
        broadcastType: broadcastType || null,
      },
    })

    // Revalidate page
    revalidatePath(`/upload/[id]`)
    revalidatePath(`/content`)
    revalidatePath(`/content/[type]`)
    revalidatePath(`/`)
  } catch (error) {
    console.error(error)
  }
}

export async function saveBlogPost({
  publishId,
  title,
  imageUrl,
  imageRef,
  filename,
  primaryCategory,
  secondaryCategory,
  tags,
  content,
  htmlContent,
  preview,
  visibility,
}: Pick<
  UpdateBlogInput,
  | "publishId"
  | "title"
  | "imageUrl"
  | "imageRef"
  | "filename"
  | "primaryCategory"
  | "secondaryCategory"
  | "tags"
  | "content"
  | "htmlContent"
  | "preview"
  | "visibility"
>) {
  try {
    const data = await getAccount()
    const account = data?.account
    const idToken = data?.idToken
    const signature = data?.signature
    const profile = account?.defaultProfile
    if (!account || !profile || !idToken)
      throw new Error("Please sign in to proceed.")

    await updateBlog({
      idToken,
      signature,
      input: {
        creatorId: profile.id,
        accountId: account.id,
        owner: account.owner,
        publishId,
        title,
        imageUrl,
        imageRef,
        filename,
        primaryCategory,
        secondaryCategory,
        tags,
        content: content ? JSON.parse(content) : null,
        htmlContent,
        preview,
        visibility,
      },
    })

    // Revalidate page
    revalidatePath(`/upload/[id]`)
    revalidatePath(`/content`)
    revalidatePath(`/content/[type]`)
    revalidatePath(`/blogs`)
  } catch (error) {
    console.error(error)
  }
}

/**
 * @param publishId An id of the publish to be liked
 */
export async function likePublish(publishId: string) {
  try {
    const data = await getAccount()
    const account = data?.account
    const idToken = data?.idToken
    const signature = data?.signature
    if (!account || !account?.defaultProfile || !idToken)
      throw new Error("Please sign in to proceed.")

    if (!publishId) throw new Error("Bad input")

    await like({
      idToken,
      signature,
      input: {
        accountId: account.id,
        owner: account.owner,
        profileId: account.defaultProfile?.id,
        publishId,
      },
    })

    // Revalidate the watch page
    revalidatePath(`/watch/[id]`)
  } catch (error) {
    console.error(error)
  }
}

/**
 * @param publishId An id of the publish to be liked
 */
export async function disLikePublish(publishId: string) {
  try {
    const data = await getAccount()
    const account = data?.account
    const idToken = data?.idToken
    const signature = data?.signature
    if (!account || !account?.defaultProfile || !idToken)
      throw new Error("Please sign in to proceed.")

    if (!publishId) throw new Error("Bad input")

    await disLike({
      idToken,
      signature,
      input: {
        accountId: account.id,
        owner: account.owner,
        profileId: account.defaultProfile?.id,
        publishId,
      },
    })

    // Revalidate the watch page
    revalidatePath(`/watch/[id]`)
  } catch (error) {
    console.error(error)
  }
}

export async function commentOnVideo(content: string, publishId: string) {
  try {
    const data = await getAccount()
    const account = data?.account
    const idToken = data?.idToken
    const signature = data?.signature
    if (!account || !account?.defaultProfile || !idToken)
      throw new Error("Please sign in to proceed.")

    if (!content || !publishId) throw new Error("Bad input")

    await commentPublish({
      idToken,
      signature,
      input: {
        accountId: account.id,
        owner: account.owner,
        profileId: account.defaultProfile?.id,
        publishId,
        content,
        commentType: "PUBLISH",
      },
    })

    // Revalidate the watch page
    revalidatePath(`/watch/[id]`)
  } catch (error) {
    console.error(error)
  }
}

export async function commentOnVideoComment(
  content: string,
  publishId: string,
  commentId: string
) {
  try {
    const data = await getAccount()
    const account = data?.account
    const idToken = data?.idToken
    const signature = data?.signature
    if (!account || !account?.defaultProfile || !idToken)
      throw new Error("Please sign in to proceed.")

    if (!content || !publishId || !commentId) throw new Error("Bad input")

    await commentPublish({
      idToken,
      signature,
      input: {
        accountId: account.id,
        owner: account.owner,
        profileId: account.defaultProfile?.id,
        publishId,
        content,
        commentType: "COMMENT",
        commentId,
      },
    })

    // Revalidate the watch page
    revalidatePath(`/watch/[id]`)
  } catch (error) {
    console.error(error)
  }
}

/**
 * @param publishId An id of the publish that the comment belongs to
 * @param commentId An id of the comment to be liked
 */
export async function likePublishComment(publishId: string, commentId: string) {
  try {
    const data = await getAccount()
    const account = data?.account
    const idToken = data?.idToken
    const signature = data?.signature
    if (!account || !account?.defaultProfile || !idToken)
      throw new Error("Please sign in to proceed.")

    if (!publishId || !commentId) throw new Error("Bad input")

    await likeComment({
      idToken,
      signature,
      input: {
        accountId: account.id,
        owner: account.owner,
        profileId: account.defaultProfile?.id,
        publishId,
        commentId,
      },
    })

    // Revalidate the watch page
    revalidatePath(`/watch/[id]`)
    revalidatePath(`/read/[id]`)
  } catch (error) {
    console.error(error)
  }
}

/**
 * @param publishId An id of the publish that the comment belongs to
 * @param commentId An id of the comment to be liked
 */
export async function disLikePublishComment(
  publishId: string,
  commentId: string
) {
  try {
    const data = await getAccount()
    const account = data?.account
    const idToken = data?.idToken
    const signature = data?.signature
    if (!account || !account?.defaultProfile || !idToken)
      throw new Error("Please sign in to proceed.")

    if (!publishId || !commentId) throw new Error("Bad input")

    await disLikeComment({
      idToken,
      signature,
      input: {
        accountId: account.id,
        owner: account.owner,
        profileId: account.defaultProfile?.id,
        publishId,
        commentId,
      },
    })

    // Revalidate the watch page
    revalidatePath(`/watch/[id]`)
    revalidatePath(`/read/[id]`)
  } catch (error) {
    console.error(error)
  }
}

/**
 * @param publishId A publish id to be reported
 * @param reason A reason to be reported
 */
export async function reportPublish(publishId: string, reason: ReportReason) {
  try {
    const data = await getAccount()
    const account = data?.account
    const idToken = data?.idToken
    const signature = data?.signature
    if (!account || !account?.defaultProfile || !idToken)
      throw new Error("Please sign in to proceed.")

    if (!publishId) throw new Error("Bad input")

    await report({
      idToken,
      signature,
      input: {
        accountId: account.id,
        owner: account.owner,
        profileId: account.defaultProfile?.id,
        publishId,
        reason,
      },
    })
  } catch (error) {
    console.error(error)
  }
}

/**
 * @param publishId A publish id to be counted
 */
export async function countPublishViews(publishId: string) {
  try {
    if (!publishId) throw new Error("Bad input")

    await countViews(publishId)

    // Revalidate watch page
    revalidatePath(`/`)
    revalidatePath(`/watch/[id]`)
  } catch (error) {
    console.error(error)
  }
}

export async function commentOnBlog({
  publishId,
  contentBlog,
  htmlContentBlog,
}: Pick<CommentPublishInput, "publishId" | "contentBlog" | "htmlContentBlog">) {
  try {
    const data = await getAccount()
    const account = data?.account
    const idToken = data?.idToken
    const signature = data?.signature
    if (!account || !account?.defaultProfile || !idToken)
      throw new Error("Please sign in to proceed.")

    if (!publishId || !contentBlog || !htmlContentBlog)
      throw new Error("Bad input")

    await commentPublish({
      idToken,
      signature,
      input: {
        accountId: account.id,
        owner: account.owner,
        profileId: account.defaultProfile?.id,
        publishId,
        commentType: "PUBLISH",
        contentBlog: JSON.parse(contentBlog),
        htmlContentBlog,
      },
    })

    // Revalidate the read page
    revalidatePath(`/read/[id]`)
  } catch (error) {
    console.error(error)
  }
}

export async function commentOnBlogComment({
  publishId,
  commentId,
  contentBlog,
  htmlContentBlog,
}: Pick<
  CommentPublishInput,
  "publishId" | "commentId" | "contentBlog" | "htmlContentBlog"
>) {
  try {
    const data = await getAccount()
    const account = data?.account
    const idToken = data?.idToken
    const signature = data?.signature
    if (!account || !account?.defaultProfile || !idToken)
      throw new Error("Please sign in to proceed.")

    if (!publishId || !commentId || !contentBlog || !htmlContentBlog)
      throw new Error("Bad input")

    await commentPublish({
      idToken,
      signature,
      input: {
        accountId: account.id,
        owner: account.owner,
        profileId: account.defaultProfile?.id,
        publishId,
        commentId,
        commentType: "COMMENT",
        contentBlog: JSON.parse(contentBlog),
        htmlContentBlog,
      },
    })

    // Revalidate the read page
    revalidatePath(`/read/[id]`)
  } catch (error) {
    console.error(error)
  }
}

export async function deletePublishComment(commentId: string) {
  try {
    const data = await getAccount()
    const account = data?.account
    const idToken = data?.idToken
    const signature = data?.signature
    if (!account || !account?.defaultProfile || !idToken)
      throw new Error("Please sign in to proceed.")

    if (!commentId) throw new Error("Bad input")

    await deleteComment({
      idToken,
      signature,
      input: {
        accountId: account.id,
        owner: account.owner,
        profileId: account.defaultProfile?.id,
        commentId,
      },
    })

    // Revalidate the read page
    revalidatePath(`/read/[id]`)
    revalidatePath(`/watch/[id]`)
    revalidatePath(`/shorts`)
  } catch (error) {
    console.error(error)
  }
}

export async function bookmarkPost(publishId: string) {
  try {
    const data = await getAccount()
    const account = data?.account
    const idToken = data?.idToken
    const signature = data?.signature
    const profile = account?.defaultProfile
    if (!account || !profile || !idToken)
      throw new Error("Please sign in to proceed.")

    await bookmark({
      idToken,
      signature,
      input: {
        accountId: account.id,
        owner: account.owner,
        profileId: profile.id,
        publishId,
      },
    })

    // Revalidate page
    revalidatePath(`/blogs`)
    revalidatePath(`/read/[id]`)
  } catch (error) {
    console.error(error)
  }
}

export async function removeOneBookmark(publishId: string) {
  try {
    const data = await getAccount()
    const account = data?.account
    const idToken = data?.idToken
    const signature = data?.signature
    if (!account || !account?.defaultProfile || !idToken)
      throw new Error("Please sign in to proceed.")

    if (!publishId) throw new Error("Bad input")

    // Remove from watch later
    await removeBookmark({
      idToken,
      signature,
      input: {
        accountId: account.id,
        owner: account.owner,
        profileId: account.defaultProfile?.id,
        publishId,
      },
    })

    // Revalidate reading list page
    revalidatePath(`/library/readinglist`)
    revalidatePath(`/tag/[name]`)
  } catch (error) {
    console.error(error)
  }
}

export async function removeBookmarks() {
  try {
    const data = await getAccount()
    const account = data?.account
    const idToken = data?.idToken
    const signature = data?.signature
    if (!account || !account?.defaultProfile || !idToken)
      throw new Error("Please sign in to proceed.")

    // Remove from watch later
    await removeAllBookmarks({
      idToken,
      signature,
      input: {
        accountId: account.id,
        owner: account.owner,
        profileId: account.defaultProfile?.id,
      },
    })

    // Revalidate library page
    revalidatePath(`/library`)
    revalidatePath(`/library/readinglist`)
  } catch (error) {
    console.error(error)
  }
}
