import React, { useRef, useState, useCallback } from "react"

import Avatar from "@/components/Avatar"
import type { Maybe, Profile } from "@/graphql/codegen/graphql"

interface Props {
  inputId: string
  profile: Maybe<Profile> | undefined
  avatarSize?: number
  replyTo?: string
  onSubmit: () => Promise<"Ok" | null>
  fontSize?: "sm" | "base" | "lg"
  clearComment: () => void
}

export default function CommentBox({
  inputId,
  profile,
  avatarSize,
  replyTo,
  onSubmit,
  fontSize = "base",
  clearComment,
}: Props) {
  const [isActive, setIsActive] = useState(false)

  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const startComment = useCallback(() => {
    setIsActive(true)
  }, [])

  const endComment = useCallback(() => {
    setIsActive(false)
    clearComment()
  }, [clearComment])

  const onConfirm = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      const result = onSubmit()
      if (!result) return
      setIsActive(false)
    },
    [onSubmit]
  )

  return (
    <form className="my-4 w-full" onSubmit={onConfirm}>
      <div className="w-full flex gap-x-2">
        <Avatar profile={profile} width={avatarSize} height={avatarSize} />
        <textarea
          ref={textareaRef}
          id={inputId}
          name="content"
          placeholder="Add a comment..."
          rows={isActive ? 2 : 1}
          className={`flex-grow border border-neutral-200 rounded-md px-4 py-1 text-textDark ${
            fontSize === "sm"
              ? "text-sm"
              : fontSize === "lg"
              ? "text-lg"
              : "text-base"
          }`}
          defaultValue={replyTo}
          onClick={startComment}
        />
      </div>
      {isActive && (
        <div className="mt-2 flex items-center justify-end gap-x-6">
          <button
            type="button"
            className={`btn-cancel mx-0 rounded-full ${
              fontSize === "sm"
                ? "text-xs px-3 h-6"
                : fontSize === "lg"
                ? "text-lg  px-4 h-8"
                : "text-base px-4 h-8"
            }`}
            onClick={endComment}
          >
            Cancel
          </button>
          <button
            type="submit"
            className={`btn-dark mx-0 rounded-full ${
              fontSize === "sm"
                ? "text-xs px-3 h-6"
                : fontSize === "lg"
                ? "text-lg px-4 h-8"
                : "text-base px-4 h-8"
            }`}
          >
            Submit
          </button>
        </div>
      )}
    </form>
  )
}
