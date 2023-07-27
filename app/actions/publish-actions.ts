"use server"

import { revalidatePath } from "next/cache"

import { updateVideo, updateBlog } from "@/graphql"
import { getAccount } from "@/lib/server"
import type { UpdateBlogInput, UpdateVideoInput } from "@/graphql/types"

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
    revalidatePath(`/upload/publishes`)
    revalidatePath(`/upload/publishes/[type]`)
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
    revalidatePath(`/upload/publishes`)
    revalidatePath(`/upload/publishes/[type]`)
    revalidatePath(`/blogs`)
  } catch (error) {
    console.error(error)
  }
}
