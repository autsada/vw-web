import React, { useState, useCallback, useTransition } from "react"
import { BsBookmarkFill, BsBookmark } from "react-icons/bs"
import { useRouter } from "next/navigation"

import Reaction from "@/components/Reaction"
import Mask from "@/components/Mask"
import { useAuthContext } from "@/context/AuthContext"
import { bookmarkPost } from "@/app/actions/publish-actions"
import type { Publish } from "@/graphql/codegen/graphql"

interface Props {
  isAuthenticated: boolean
  publish: Publish
  buttonWidth?: string // h-[40px]
  buttonHeight?: string // h-[40px]
}

export default function BookmarkReaction({
  isAuthenticated,
  publish,
  buttonWidth,
  buttonHeight,
}: Props) {
  const publishId = publish.id
  const bookmarked = !!publish.bookmarked
  const [optimisticBookmarked, setOptimisticBookmarked] = useState(bookmarked)

  const [isPending, startTransition] = useTransition()
  const { onVisible: openAuthModal } = useAuthContext()
  const router = useRouter()

  const bookmark = useCallback(() => {
    if (!isAuthenticated) {
      openAuthModal("Sign in to bookmark the blog.")
    } else {
      setOptimisticBookmarked((prev) => !prev)
      startTransition(() => bookmarkPost(publishId))
      // Refresh to update the UIs
      router.refresh()
    }
  }, [isAuthenticated, publishId, openAuthModal, router])

  return (
    <>
      <Reaction
        IconOutline={BsBookmark}
        IconFill={BsBookmarkFill}
        isActive={optimisticBookmarked}
        width={buttonWidth}
        height={buttonHeight}
        onClick={bookmark}
        withDescription={false}
        size={18}
      />

      {/* Prevent user interactions */}
      {isPending && <Mask />}
    </>
  )
}
