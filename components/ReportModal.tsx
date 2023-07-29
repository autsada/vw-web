import React, { useCallback, useRef, useState, useTransition } from "react"
import { MdOutlineNavigateNext } from "react-icons/md"
import { toast } from "react-toastify"

import ModalWrapper from "@/components/ModalWrapper"
import CloseButton from "@/components/CloseButton"
import ConfirmModal from "@/components/ConfirmModal"
import { reportPublish } from "@/app/actions/publish-actions"
import type { ReportReason } from "@/graphql/types"

interface Props {
  title?: string
  closeModal: () => void
  publishId: string
}

export default function ReportModal({ title, closeModal, publishId }: Props) {
  const [conformModalVisible, setConfirmModalVisible] = useState(false)
  const [selectedTopic, setSelectedTopic] = useState<HTMLInputElement>()

  const [isPending, startTransition] = useTransition()

  const onNext = useCallback(() => {
    const els = document.getElementsByTagName("input")
    let value: HTMLInputElement | undefined = undefined
    for (let i = 0; i < els.length; i++) {
      if (els[i].checked) {
        value = els[i]
      }
    }
    if (!value) return
    setSelectedTopic(value)
    setConfirmModalVisible(true)
  }, [])

  const onBack = useCallback(() => {
    setConfirmModalVisible(false)
  }, [])

  const confirmReport = useCallback(() => {
    if (!publishId || !selectedTopic) return

    const reason = selectedTopic.defaultValue as ReportReason
    startTransition(() => reportPublish(publishId, reason))
    toast.success("Publish is reported", { theme: "dark" })
    closeModal()
  }, [publishId, closeModal, selectedTopic])

  return (
    <ModalWrapper visible zIndex="z-[70]" backdropZIndex="z-[60]">
      <div className="fixed z-10 inset-0" onClick={closeModal}></div>
      <div className="relative z-20 pt-5 w-[400px] max-w-[85%] text-center bg-white rounded-xl overflow-hidden">
        <div className="px-10 flex items-center justify-between">
          <p className="text-lg text-left">{title || "Report video"}</p>
          <div>
            <CloseButton onClick={closeModal} />
          </div>
        </div>
        <form className="mt-2">
          <div className="px-10">
            <Item name="report" defaultValue="adult" title="Adult content" />
            <Item
              name="report"
              defaultValue="violent"
              title="Violent content"
            />
            <Item
              name="report"
              defaultValue="harass"
              title="Harassing or bullying content"
            />
            <Item
              name="report"
              defaultValue="hateful"
              title="Hatefule content"
            />
            <Item
              name="report"
              defaultValue="harmful"
              title="Harmful or dangerous acts"
            />
            <Item
              name="report"
              defaultValue="abuse"
              title="Human or animal abusive content"
            />
            <Item
              name="report"
              defaultValue="terrorism"
              title="Support or promote terrorism content"
            />
            <Item name="report" defaultValue="spam" title="Spam content" />
            <Item
              name="report"
              defaultValue="mislead"
              title="Misleading information"
            />
          </div>
          <div className="mt-4 w-full border-t border-neutral-200 flex items-center justify-end py-3 px-6">
            <div
              className="flex items-center justify-center gap-x-3 cursor-pointer"
              onClick={onNext}
            >
              <p>Next</p>
              <MdOutlineNavigateNext size={22} />
            </div>
          </div>
        </form>
      </div>

      {conformModalVisible && selectedTopic && (
        <ConfirmModal onCancel={onBack} onConfirm={confirmReport}>
          <div>
            <p className="text-lg">
              You are going to report this {title ? "blog" : "video"} for the
              following topic.
            </p>
            <div className="mt-5 py-4 border border-neutral-400 rounded-md">
              <h6 className="text-base">{selectedTopic.title}</h6>
            </div>
          </div>
        </ConfirmModal>
      )}
    </ModalWrapper>
  )
}

function Item({
  name,
  title,
  defaultValue,
}: {
  name: string
  title: string
  defaultValue: ReportReason
}) {
  const ref = useRef<HTMLInputElement>(null)

  const handleClick = useCallback(() => {
    if (ref.current) {
      ref.current.click()
    }
  }, [])

  return (
    <div className="my-1 py-2 flex items-center justify-between gap-x-4 cursor-pointer">
      <div className="w-max">
        <input
          ref={ref}
          type="radio"
          name={name}
          defaultValue={defaultValue}
          className="w-[20px] h-[20px] flex items-center justify-center font-semibold text-lg border-[2px] border-neutral-400 cursor-pointer"
          title={title}
        />
      </div>
      <div className="h-full flex-grow" onClick={handleClick}>
        <p className="font-light text-left text-textLight">{title}</p>
      </div>
    </div>
  )
}
