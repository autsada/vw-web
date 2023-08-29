import React, { useCallback } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { TfiWrite } from "react-icons/tfi"
import { RiLiveLine } from "react-icons/ri"
import { CiStreamOn } from "react-icons/ci"
import type { IconType } from "react-icons"

import Backdrop from "../Backdrop"

interface Props {
  visible: boolean
  closeModal: () => void
}

export default function StartUploadModal({ visible, closeModal }: Props) {
  const router = useRouter()

  const startUpload = useCallback(
    async (t: "video" | "blog") => {
      router.push(`/upload?t=${t}`, { scroll: true })
    },
    [router]
  )

  if (!visible) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="relative z-[60] shadow-md bg-white py-4 rounded-md flex flex-col gap-y-1 font-semibold">
        <ActionItem
          name="Upload video"
          Icon={RiLiveLine}
          onClick={startUpload.bind(undefined, "video")}
        />
        <Link href="/livestreaming">
          <ActionItem name="Go live" Icon={CiStreamOn} />
        </Link>
        <ActionItem
          name="Create blog"
          Icon={TfiWrite}
          iconSize={15}
          onClick={startUpload.bind(undefined, "blog")}
        />
      </div>
      <Backdrop zIndex="z-[50]" visible={visible} onClick={closeModal} />
    </div>
  )
}

function ActionItem({
  name,
  Icon,
  iconSize = 20,
  onClick,
}: {
  name: string
  Icon: IconType
  iconSize?: number
  onClick?: () => void
}) {
  return (
    <div
      className="h-[40px] w-[250px] min-w-max px-5 flex items-center gap-x-5 cursor-pointer hover:bg-neutral-100"
      onClick={onClick}
    >
      <div className="w-[40px] flex items-center justify-center">
        <Icon size={iconSize} />
      </div>
      <div className="flex-grow">{name}</div>
    </div>
  )
}
