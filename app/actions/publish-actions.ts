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
  addToNewPlaylist,
  addToWatchLater,
  removeWatchLater,
  updatePlaylists,
  dontRecommend,
  report,
  countViews,
  deleteComment,
} from "@/graphql"
import { getAccount } from "@/lib/server"
import type {
  CommentPublishInput,
  DisplayedPlaylist,
  ReportReason,
  UpdateBlogInput,
  UpdateVideoInput,
} from "@/graphql/types"
import _ from "lodash"

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
        tags,
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
  } catch (error) {
    console.error(error)
  }
}

/**
 * Create a new playlist and add a publish to it
 */
export async function createNewPlaylist(formData: FormData) {
  try {
    const data = await getAccount()
    const account = data?.account
    const idToken = data?.idToken
    const signature = data?.signature
    if (!account || !account?.defaultProfile || !idToken)
      throw new Error("Please sign in to proceed.")

    const name = formData.get("name") as string
    const publishId = formData.get("publish") as string
    if (
      !name ||
      typeof name !== "string" ||
      !publishId ||
      typeof publishId !== "string"
    )
      throw new Error("Bad input")

    // Create a new playlist and add the publish to it
    await addToNewPlaylist({
      idToken,
      signature,
      input: {
        accountId: account.id,
        owner: account.owner,
        profileId: account.defaultProfile?.id,
        name,
        publishId,
      },
    })

    // Revalidate library page
    revalidatePath(`/`)
  } catch (error) {
    console.error(error)
  }
}

export async function saveToWatchLater(publishId: string) {
  try {
    const data = await getAccount()
    const account = data?.account
    const idToken = data?.idToken
    const signature = data?.signature
    if (!account || !account?.defaultProfile || !idToken)
      throw new Error("Please sign in to proceed.")

    if (!publishId) throw new Error("Bad input")

    await addToWatchLater({
      idToken,
      signature,
      input: {
        accountId: account.id,
        owner: account.owner,
        profileId: account.defaultProfile?.id,
        publishId,
      },
    })

    // Revalidate watch later page
    revalidatePath(`/library/VL`)
    revalidatePath(`/library`)
  } catch (error) {
    console.error(error)
  }
}

export async function saveToPlaylist(formData: FormData) {
  try {
    const data = await getAccount()
    const account = data?.account
    const idToken = data?.idToken
    const signature = data?.signature
    if (!account || !account?.defaultProfile || !idToken)
      throw new Error("Please sign in to proceed.")

    const publishId = formData.get("publish") as string
    if (!publishId) throw new Error("Bad input")

    // Get watch later values (old, new)
    const oldWL = formData.get("oldWL") as "on" | "off"
    const newWL = (formData.get("newWL") as "on" | "") || "off"

    if (oldWL !== newWL) {
      // Update watch later
      if (newWL === "on") {
        // Add to watch later
        await addToWatchLater({
          idToken,
          signature,
          input: {
            accountId: account.id,
            owner: account.owner,
            profileId: account.defaultProfile?.id,
            publishId,
          },
        })
      }
      if (newWL === "off") {
        // Remove from watch later
        await removeWatchLater({
          idToken,
          signature,
          input: {
            accountId: account.id,
            owner: account.owner,
            profileId: account.defaultProfile?.id,
            publishId,
          },
        })
      }

      // Revalidate watch later page
      revalidatePath(`/library/VL`)
    }

    // Get playlists values (old, new)
    const oldPlaylists = JSON.parse(
      formData.get("playlists") as string
    ) as DisplayedPlaylist[]
    const newPlaylists = oldPlaylists.map((pl) => {
      const checked = formData.get(pl.list?.id || "")

      return {
        isInPlaylist: checked === "on" ? true : false,
        list: pl.list,
      }
    })
    // Check if playlists are changed
    const isPlaylistsEqual = _.isEqual(oldPlaylists, newPlaylists)

    // If the playlists are updated, get the ones that are updated and put them in a new array, so all the items in this array are the playlists to be updated.
    const updatedPlaylists: DisplayedPlaylist[] = []
    if (!isPlaylistsEqual) {
      newPlaylists.forEach((pl, index) => {
        if (!_.isEqual(oldPlaylists[index], pl)) {
          updatedPlaylists.push(pl)
        }
      })
    }

    if (updatedPlaylists.length > 0) {
      await updatePlaylists({
        idToken,
        signature,
        input: {
          accountId: account.id,
          owner: account.owner,
          profileId: account.defaultProfile?.id,
          publishId,
          playlists: updatedPlaylists.map((pl) => ({
            isInPlaylist: !!pl.isInPlaylist,
            playlistId: pl.list?.id || "",
          })),
        },
      })

      // Revalidate watch page
      revalidatePath(`/watch/[id]`)
    }
  } catch (error) {
    console.error(error)
  }
}

/**
 * @param targetId A profile id to be added to don't recommend list
 */
export async function dontRecommendProfile(targetId: string) {
  try {
    const data = await getAccount()
    const account = data?.account
    const idToken = data?.idToken
    const signature = data?.signature
    if (!account || !account?.defaultProfile || !idToken)
      throw new Error("Please sign in to proceed.")

    if (!targetId) throw new Error("Bad input")
    // If user added their own profile to the list, just return
    if (account.defaultProfile.id === targetId) return

    await dontRecommend({
      idToken,
      signature,
      input: {
        accountId: account.id,
        owner: account.owner,
        profileId: account.defaultProfile?.id,
        targetId,
      },
    })

    // Revalidate page
    revalidatePath(`/`)
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
