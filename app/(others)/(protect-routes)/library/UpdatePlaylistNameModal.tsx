import React from "react"

import CloseButton from "@/components/CloseButton"
import ModalWrapper from "@/components/ModalWrapper"
import type { PreviewPlaylist } from "@/graphql/codegen/graphql"

interface Props {
  playlist: PreviewPlaylist
  closeModal: () => void
  confirmUpdatePlaylist: () => void
}

export default function UpdatePlaylistNameModal({
  playlist,
  closeModal,
  confirmUpdatePlaylist,
}: Props) {
  return (
    <ModalWrapper visible withBackdrop>
      <div className="relative z-50 w-[90%] sm:w-[60%] md:w-[50%] lg:w-[35%] mx-auto px-2 pt-8 pb-4 bg-white rounded-xl text-center">
        <div className="absolute top-2 right-4">
          <CloseButton onClick={closeModal} className="text-base" />
        </div>

        <div className="w-full mt-5 px-6">
          <h6 className="text-left text-base mb-1">Change playlist name</h6>
          <label htmlFor="name">
            <input
              id="playlist-new-name"
              type="text"
              name="name"
              minLength={3}
              maxLength={120}
              defaultValue={playlist.name}
              required
              placeholder="Playlist name (3-120 char)"
              className="block w-full border border-neutral-200 focus:border-orangeDark rounded-md h-[40px] px-2"
            />
          </label>

          <button
            type="button"
            className="w-full mt-5 bg-neutral:50 hover:bg-neutral-100 rounded-md font-semibold text-blueBase"
            onClick={confirmUpdatePlaylist}
          >
            Update
          </button>
        </div>
      </div>
    </ModalWrapper>
  )
}
