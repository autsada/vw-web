import { NextResponse } from "next/server"

import { updateBlog } from "@/graphql"
import { getAccount } from "@/lib/server"
import type { UpdateBlogInput } from "@/graphql/codegen/graphql"

/**
 * Use this api route instead of action server so we can return the result.
 */
export async function POST(req: Request) {
  const data = await getAccount()
  const account = data?.account
  const idToken = data?.idToken
  const signature = data?.signature
  const profile = account?.defaultProfile
  if (!account || !profile || !idToken)
    throw new Error("Please sign in to proceed.")

  const {
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
  } = (await req.json()) as Pick<
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
  >

  if (!publishId) return

  const result = await updateBlog({
    idToken,
    signature,
    input: {
      creatorId: profile.id,
      accountId: account.id,
      owner: account.owner,
      publishId,
      title: title || null,
      imageUrl: imageUrl || null,
      imageRef: imageRef || null,
      filename: filename || null,
      primaryCategory: primaryCategory || null,
      secondaryCategory: secondaryCategory || null,
      tags: tags || null,
      content: content ? JSON.parse(content) : null,
      htmlContent: htmlContent || null,
      preview: preview || null,
      visibility: visibility || null,
    },
  })

  return NextResponse.json(result)
}
