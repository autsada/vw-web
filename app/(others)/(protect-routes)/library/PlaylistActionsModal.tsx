import React from "react"
import { MdOutlineEdit } from "react-icons/md"
import { IoTrashOutline } from "react-icons/io5"
import type { IconType } from "react-icons"

import ModalWrapper from "@/components/ModalWrapper"

interface Props {
  closeModal: () => void
  top: number
  left: number
  startDeletePlaylist: () => void
  startUpdatePlaylist: () => void
}

export default function PlaylistActionsModal({
  closeModal,
  top,
  left,
  startDeletePlaylist,
  startUpdatePlaylist,
}: Props) {
  return (
    <ModalWrapper visible>
      <div className="relative z-0 w-full h-full">
        <div className="relative z-0 w-full h-full" onClick={closeModal}></div>

        <div
          className={`absolute z-10 flex flex-col items-center justify-center bg-white rounded-xl w-[250px] h-[120px]`}
          style={{
            top,
            left,
          }}
        >
          <Item
            Icon={IoTrashOutline}
            text="Delete playlist"
            onClick={startDeletePlaylist}
          />
          <Item
            Icon={MdOutlineEdit}
            text="Edit playlist name"
            onClick={startUpdatePlaylist}
          />
        </div>
      </div>
    </ModalWrapper>
  )
}

function Item({
  Icon,
  text,
  onClick,
}: {
  Icon: IconType
  text: string
  onClick: React.MouseEventHandler<HTMLDivElement> | undefined
}) {
  return (
    <div
      className="w-full flex items-center justify-center py-2 px-8 my-1 cursor-pointer hover:bg-neutral-100"
      onClick={onClick}
    >
      <div className="w-[30px] flex items-center justify-center">
        <Icon size={24} />
      </div>
      <div className="flex-grow text-left">
        <p className="font-light ml-5">{text}</p>
      </div>
    </div>
  )
}
