import React from "react"

import type { CommentsOrderBy } from "@/graphql/types"

interface Props {
  sortBy: CommentsOrderBy
  pos: "top" | "bottom"
  select: (s: CommentsOrderBy) => void
}

export default function SortByModal({ sortBy, pos, select }: Props) {
  return (
    <div
      className={`absolute z-20 ${
        pos === "top" ? "-top-[100px]" : "-bottom-[100px]"
      } h-[100px] w-[150px] rounded-xl overflow-hidden shadow-2xl`}
    >
      <button
        type="button"
        className={`w-full h-[50px] text-sm justify-start pl-6 ${
          sortBy === "counts" ? "bg-neutral-300" : "bg-neutral-100"
        } hover:bg-neutral-200`}
        onClick={select.bind(undefined, "counts")}
      >
        Top comments
      </button>
      <button
        type="button"
        className={`w-full h-[50px] text-sm justify-start pl-6 ${
          sortBy === "newest" ? "bg-neutral-300" : "bg-neutral-100"
        } hover:bg-neutral-200`}
        onClick={select.bind(undefined, "newest")}
      >
        Newest
      </button>
    </div>
  )
}
