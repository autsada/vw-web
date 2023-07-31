import React, { useState, useCallback } from "react"
import { MdOutlineSort } from "react-icons/md"

import SortByModal from "./SortByModal"
import type { PlaylistOrderBy } from "@/graphql/types"

interface Props {
  sortBy: PlaylistOrderBy
  onSelectSortBy: (s: PlaylistOrderBy) => void
}

export default function ItemsHeader({ sortBy, onSelectSortBy }: Props) {
  const [sortBySelectionVisible, setSortBySelectionVisible] = useState(false)
  const [sortByPosY, setSortByPosY] = useState(0)
  const [screenHeight, setScreenHeight] = useState(0)

  const toggleSortBy = useCallback(
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      setSortBySelectionVisible((prev) => {
        if (!prev) {
          setSortByPosY(e.clientY)
          setScreenHeight(window?.innerHeight)
        } else {
          setSortByPosY(0)
          setScreenHeight(0)
        }
        return !prev
      })
    },
    []
  )

  return (
    <>
      <div
        className="h-full relative z-10 flex items-center gap-x-1 cursor-pointer"
        onClick={toggleSortBy}
      >
        <MdOutlineSort className="text-textExtraLight" size={24} />
        <p className="font-semibold text-sm">Sort by</p>

        {sortBySelectionVisible && (
          <SortByModal
            sortBy={sortBy}
            pos={screenHeight - sortByPosY < 100 ? "top" : "bottom"} // 100 is modal height
            select={onSelectSortBy}
          />
        )}
      </div>

      {/* To close sortby modal when clicks outside */}
      {sortBySelectionVisible && (
        <div className="fixed z-0 inset-0" onClick={toggleSortBy}></div>
      )}
    </>
  )
}
