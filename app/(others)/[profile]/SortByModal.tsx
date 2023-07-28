import React from "react"

import type { PublishOrderBy } from "@/graphql/types"

interface Props {
  sortBy: PublishOrderBy
  pos: "top" | "bottom"
  select: (s: PublishOrderBy) => void
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
          sortBy === "latest" ? "bg-neutral-300" : "bg-neutral-100"
        } hover:bg-neutral-200`}
        onClick={select.bind(undefined, "latest")}
      >
        Latest
      </button>
      <button
        type="button"
        className={`w-full h-[50px] text-sm justify-start pl-5 ${
          sortBy === "popular" ? "bg-neutral-300" : "bg-neutral-100"
        } hover:bg-neutral-200`}
        onClick={select.bind(undefined, "popular")}
      >
        Popular
      </button>
    </div>
  )
}
