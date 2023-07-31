import React from "react"

import type { PlaylistOrderBy } from "@/graphql/types"

interface Props {
  sortBy: PlaylistOrderBy
  pos: "top" | "bottom"
  select: (s: PlaylistOrderBy) => void
}

export default function SortByModal({ sortBy, pos, select }: Props) {
  return (
    <div
      className={`absolute z-20 ${
        pos === "top" ? "-top-[100px]" : "-bottom-[100px]"
      } h-[100px] w-[180px] rounded-xl overflow-hidden shadow-2xl`}
    >
      <button
        type="button"
        className={`w-full h-[50px] text-sm justify-start pl-5 ${
          sortBy === "newest" ? "bg-neutral-300" : "bg-neutral-100"
        } hover:bg-neutral-200`}
        onClick={select.bind(undefined, "newest")}
      >
        Date added (newest)
      </button>
      <button
        type="button"
        className={`w-full h-[50px] text-sm justify-start pl-5 ${
          sortBy === "oldest" ? "bg-neutral-300" : "bg-neutral-100"
        } hover:bg-neutral-200`}
        onClick={select.bind(undefined, "oldest")}
      >
        Date added (oldest)
      </button>
    </div>
  )
}
