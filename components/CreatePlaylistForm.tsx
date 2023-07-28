import React from "react"
import { toast } from "react-toastify"

import { createNewPlaylist } from "@/app/actions/publish-actions"

interface Props {
  publishId: string
  onFinished: () => void
}

export default function CreatePlaylistForm({ publishId, onFinished }: Props) {
  return (
    <form
      className="w-full mt-5 px-10 pb-5"
      action={createNewPlaylist}
      onSubmit={() => {
        onFinished()
        toast.success("Added to playlist", { theme: "dark" })
      }}
    >
      <h6 className="text-left text-base mb-1">New playlist</h6>
      <label htmlFor="name">
        <input
          type="text"
          name="name"
          maxLength={120}
          required
          placeholder="Playlist name (max 120)"
          className="block w-full border border-neutral-200 focus:border-orangeDark rounded-md h-[40px] px-2"
        />
      </label>
      {/* Hidden input to send publish id to server action */}
      <input
        type="text"
        name="publish"
        className="hidden"
        defaultValue={publishId}
      />

      <button
        type="submit"
        className="w-full mt-5 bg-neutral:50 hover:bg-neutral-100 rounded-md font-semibold text-blueBase"
      >
        Create playlist
      </button>
    </form>
  )
}
