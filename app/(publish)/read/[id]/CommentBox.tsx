// This comment box is different than the comment box for videos as it will also allow rich text format.

import React, { useState, useCallback } from "react"
import type { DeltaStatic } from "quill"
import parse from "html-react-parser"

import SwitchMode from "@/app/(others)/(protect-routes)/upload/[id]/SwitchMode"
import Avatar from "@/components/Avatar"
import QuillEditor from "@/app/(others)/(protect-routes)/upload/QuillEditor"
import ActionsButtons from "./ActionsButtons"
import type { Maybe, Profile } from "@/graphql/codegen/graphql"

interface Props {
  profile: Maybe<Profile> | undefined
  placeholder?: string
  avatarSize?: number
  submitComment: (content: string, htmlContent: string) => void
  cancelEdit?: () => void
}

export default function CommentBox({
  profile,
  placeholder = "Your comment...",
  avatarSize,
  submitComment,
  cancelEdit,
}: Props) {
  const [mode, setMode] = useState<"edit" | "preview">("edit")
  const [content, setContent] = useState<DeltaStatic>()
  const [contentForPreview, setContentForPreview] = useState("")

  const onSubmit = useCallback(() => {
    if (!content || !contentForPreview) return

    submitComment(JSON.stringify(content), contentForPreview)
    setContent(undefined)
    if (cancelEdit) cancelEdit()
  }, [content, contentForPreview, submitComment, cancelEdit])

  return (
    <div>
      <div className="flex items-center justify-between">
        <Avatar profile={profile} width={avatarSize} height={avatarSize} />
        <div className="w-full flex items-center justify-end gap-x-5">
          <SwitchMode mode={mode} setMode={setMode} />
        </div>
      </div>
      <div className="mt-1 h-[200px] border-[2px] border-neutral-600 rounded overflow-y-auto">
        <div className={`${mode === "edit" ? "block" : "hidden"} h-full`}>
          <QuillEditor
            placeholder={placeholder}
            content={content}
            setContent={setContent}
            setContentForPreview={setContentForPreview}
          />
        </div>
        <div
          className={`${mode === "edit" ? "hidden" : "block"} h-full px-4 py-2`}
        >
          {contentForPreview && (
            <article className="pb-10 prose prose-a:text-blue-500 prose-blockquote:font-light prose-blockquote:italic prose-p:text-base">
              {parse(contentForPreview)}
            </article>
          )}
        </div>
      </div>
      <div className="mt-2 w-full flex items-end justify-end gap-x-5">
        <ActionsButtons
          onCancel={cancelEdit || setContent.bind(undefined, undefined)}
          onSubmit={onSubmit}
        />
      </div>
    </div>
  )
}
