"use client"

import React, { useState, useCallback, useMemo, useTransition } from "react"
import _ from "lodash"
import {
  MdOutlineCheckBox,
  MdOutlineCheckBoxOutlineBlank,
} from "react-icons/md"

import BlogItem from "./BlogItem"
import ButtonLoader from "@/components/ButtonLoader"
import Mask from "@/components/Mask"
import ConfirmDeleteModal from "../../upload/[id]/ConfirmDeleteModal"
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll"
import { combineEdges } from "@/lib/helpers"
import { deleteManyPublishes } from "@/app/actions/publish-actions"
import type { FetchPublishesResponse, Maybe } from "@/graphql/codegen/graphql"

interface Props {
  fetchResult: Maybe<FetchPublishesResponse> | undefined
}

export default function Blogs({ fetchResult }: Props) {
  const [loading, setLoading] = useState(false)
  const [prevEdges, setPrevEdges] = useState(fetchResult?.edges)
  const [edges, setEdges] = useState(fetchResult?.edges || [])
  const isDeleting = edges.map((edge) => !!edge?.node?.deleting).includes(true)
  const isUploading = edges
    .map((edge) => !!edge?.node?.uploading)
    .includes(true)
  const isEdgesEqual = useMemo(
    () => _.isEqual(fetchResult?.edges, prevEdges),
    [fetchResult?.edges, prevEdges]
  )
  // When shorts changed
  if (!isEdgesEqual) {
    setPrevEdges(fetchResult?.edges)
    setEdges(fetchResult?.edges || [])
  }

  const [prevPageInfo, setPrevPageInfo] = useState(fetchResult?.pageInfo)
  const [pageInfo, setPageInfo] = useState(fetchResult?.pageInfo)
  const isPageInfoEqual = useMemo(
    () => _.isEqual(fetchResult?.pageInfo, prevPageInfo),
    [fetchResult?.pageInfo, prevPageInfo]
  )
  // When page info changed
  if (!isPageInfoEqual) {
    setPrevPageInfo(fetchResult?.pageInfo)
    setPageInfo(fetchResult?.pageInfo)
  }

  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [confirmModalVisible, setConfirmModalVisible] = useState(false)

  const [isPending, startTransition] = useTransition()

  const fetchMore = useCallback(async () => {
    if (!pageInfo || !pageInfo.endCursor || !pageInfo.hasNextPage) return

    try {
      setLoading(true)
      const res = await fetch(`/api/publish/query/my-publishes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          publishType: "blogs",
          cursor: pageInfo.endCursor,
        }),
      })
      const data = (await res.json()) as {
        result: FetchPublishesResponse
      }
      setEdges((prev) => combineEdges(prev, data?.result?.edges))
      setPageInfo(data?.result?.pageInfo)
      setLoading(false)
    } catch (error) {
      setLoading(false)
    }
  }, [pageInfo])
  const { observedRef } = useInfiniteScroll(0.5, fetchMore)

  const selectItem = useCallback((id: string) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    )
  }, [])

  const selectAll = useCallback(() => {
    setSelectedItems((prev) =>
      prev.length === edges.length
        ? []
        : edges.filter((edge) => !!edge.node?.id).map((edge) => edge.node?.id!)
    )
  }, [edges])

  const requestDeletion = useCallback(() => {
    setConfirmModalVisible(true)
  }, [])

  const cancelDeletion = useCallback(() => {
    setConfirmModalVisible(false)
  }, [])

  const confirmDeletePublishes = useCallback(() => {
    if (selectedItems.length === 0) return

    startTransition(() => deleteManyPublishes(selectedItems))
    setConfirmModalVisible(false)
    setSelectedItems([])
  }, [selectedItems])

  return edges?.length === 0 ? (
    <div className="text-center px-4 py-10">
      <h6>No results found.</h6>
    </div>
  ) : (
    <div className="relative px-0 sm:px-4 overflow-y-auto">
      {(isUploading || isDeleting) && (
        <div className="absolute top-0 right-[2px] bg-white text-blueBase px-4 py-2 font-semibold text-lg">
          While processing you can safely leave this page.
        </div>
      )}
      <table className="table-fixed w-full border-collapse">
        <thead>
          <tr className="text-sm font-semibold border-t border-b border-neutral-200">
            <th className="w-[6%] lg:w-[3%]">
              {edges.length === selectedItems.length ? (
                <MdOutlineCheckBox
                  size={24}
                  onClick={selectAll}
                  className="cursor-pointer"
                  style={{ color: "red" }}
                />
              ) : (
                <MdOutlineCheckBoxOutlineBlank
                  size={24}
                  onClick={selectAll}
                  className="cursor-pointer"
                />
              )}
            </th>
            <th className="w-[30%] sm:w-[20%] lg:w-[15%] xl:w-[12%] font-normal py-2 break-words">
              {selectedItems.length > 0 ? (
                <button
                  className="btn-cancel h-5 px-2 text-[10px]"
                  onClick={requestDeletion}
                >
                  Delete? ({selectedItems.length})
                </button>
              ) : (
                "Cover image"
              )}
            </th>
            <th className="w-[40%] sm:w-[40%] lg:w-[35%] xl:w-[35%] font-normal py-2 break-words">
              Title
            </th>
            <th className="hidden sm:table-cell sm:w-[20%] lg:w-[10%] xl:w-[7%] font-normal py-2 break-words">
              Visibility
            </th>
            <th className="w-[30%] sm:w-[20%] lg:w-[10%] xl:w-[11%] font-normal py-2 break-words">
              Date
            </th>
            <th className="hidden lg:table-cell w-[20%] lg:w-[10%] xl:w-[7%] font-normal py-2 break-words">
              Views
            </th>
            <th className="hidden lg:table-cell w-[20%] lg:w-[10%] xl:w-[7%] font-normal py-2 break-words">
              Tips
            </th>
            <th className="hidden xl:table-cell w-[20%] xl:w-[7%] font-normal py-2 break-words">
              Comments
            </th>
            <th className="hidden lg:table-cell w-[20%] lg:w-[10%] xl:w-[7%] font-normal py-2 break-words">
              Likes
            </th>
            {/* <th className="hidden xl:table-cell xl:w-[7%] font-normal py-2 break-words">
              Dislikes
            </th> */}
          </tr>
        </thead>

        <tbody>
          {edges?.map(({ cursor, node: publish }) =>
            !publish ? null : (
              <BlogItem
                key={publish.id}
                blog={publish}
                isSelected={selectedItems.includes(publish.id)}
                selectItem={selectItem}
              />
            )
          )}
        </tbody>
      </table>

      <div
        ref={observedRef}
        className="w-full h-4 flex items-center justify-center"
      >
        {loading && <ButtonLoader loading={loading} size={8} color="#d4d4d4" />}
      </div>

      {/* Confirm delete */}
      {confirmModalVisible && (
        <ConfirmDeleteModal
          loading={false}
          onCancel={cancelDeletion}
          onConfirm={confirmDeletePublishes}
        />
      )}

      {/* Prevent interaction while loading */}
      {loading && <Mask />}
    </div>
  )
}
