import React, { useState, useCallback } from "react"
import { MdOutlineSort, MdArrowBack } from "react-icons/md"

import Mask from "@/components/Mask"
import SortByModal from "./SortByModal"
import type { CommentsOrderBy } from "@/graphql/types"
import type {
  FetchCommentsResponse,
  PageInfo,
  CommentEdge,
} from "@/graphql/codegen/graphql"

interface Props {
  publishId: string
  subCommentsVisible: boolean
  commentsCount: number
  pageInfo: PageInfo | undefined
  setPageInfo: React.Dispatch<React.SetStateAction<PageInfo | undefined>>
  setEdges: React.Dispatch<React.SetStateAction<CommentEdge[]>>
  closeSubComments: () => void
  sortBy: CommentsOrderBy
  setSortBy: React.Dispatch<React.SetStateAction<CommentsOrderBy>>
}

export default function CommentsHeader({
  publishId,
  subCommentsVisible,
  commentsCount,
  pageInfo,
  setPageInfo,
  setEdges,
  closeSubComments,
  sortBy,
  setSortBy,
}: Props) {
  const [sortBySelectionVisible, setSortBySelectionVisible] = useState(false)
  const [sortByPosY, setSortByPosY] = useState(0)
  const [screenHeight, setScreenHeight] = useState(0)
  const [commentsLoading, setCommentsLoading] = useState(false)

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

  // Fetch comments when user selects sort by
  const fetchComments = useCallback(
    async (ob: CommentsOrderBy) => {
      if (!publishId) return
      try {
        setCommentsLoading(true)
        const res = await fetch(`/comments`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            publishId: publishId,
            sortBy: ob,
          }),
        })
        const data = (await res.json()) as {
          result: FetchCommentsResponse
        }
        // setCommentsResponse(data.result)
        setPageInfo(data.result?.pageInfo)
        setEdges(data.result?.edges)
        setCommentsLoading(false)
      } catch (error) {
        setCommentsLoading(false)
      }
    },
    [publishId, setPageInfo, setEdges]
  )

  const selectSortBy = useCallback(
    (s: CommentsOrderBy) => {
      setSortBy(s)
      if (s !== sortBy) {
        // Check if all items already fetched
        if (!pageInfo?.hasNextPage) {
          // A. Already fetched all, just sort the items.
          if (s === "newest") {
            setEdges((prev) =>
              prev.sort(
                (a, b) =>
                  (new Date(b.node?.createdAt) as any) -
                  (new Date(a.node?.createdAt) as any)
              )
            )
          } else {
            setEdges((prev) =>
              prev.sort(
                (a, b) =>
                  (b.node?.commentsCount || 0) - (a.node?.commentsCount || 0)
              )
            )
          }
        } else {
          // B. Has more items, start fetch from the beginning.
          fetchComments(s)
        }
      }
    },
    [sortBy, fetchComments, setSortBy, pageInfo, setEdges]
  )

  return (
    <>
      <div className="h-[30px] flex items-center gap-x-4 bg-white">
        {!subCommentsVisible ? (
          <>
            <div className="h-full flex items-center gap-x-2">
              <h6 className="text-lg sm:text-xl">{commentsCount}</h6>
              <h6 className="text-lg sm:text-xl">Comments</h6>
            </div>
            {commentsCount > 1 && (
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
                    select={selectSortBy}
                  />
                )}
              </div>
            )}
          </>
        ) : (
          <>
            <MdArrowBack
              size={22}
              className="cursor-pointer"
              onClick={closeSubComments}
            />
            <h6>Replies</h6>
          </>
        )}
      </div>

      {/* To close sortby modal when clicks outside */}
      {sortBySelectionVisible && (
        <div className="fixed z-0 inset-0" onClick={toggleSortBy}></div>
      )}

      {/* Prevent user interaciton while loading */}
      {commentsLoading && <Mask backgroundColor="white" opacity={0.2} />}
    </>
  )
}
