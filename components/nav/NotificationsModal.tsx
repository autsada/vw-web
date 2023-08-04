import React, {
  useCallback,
  useState,
  useMemo,
  useTransition,
  useEffect,
} from "react"
import _ from "lodash"

import ModalWrapper from "../ModalWrapper"
import ButtonLoader from "../ButtonLoader"
import { useSubscribeToNotifications } from "@/hooks/useSubscribe"
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll"
import type {
  Maybe,
  Profile,
  NotificationEdge,
  FetchNotificationsResponse,
  PageInfo,
} from "@/graphql/codegen/graphql"
import { calculateTimeElapsed } from "@/lib/client"
import { combineEdges } from "@/lib/helpers"
import { updateNotificationReadStatus } from "@/app/actions/notification-actions"

interface Props {
  profile: Maybe<Profile> | undefined
  modalVisible: boolean
  closeModal: () => void
}

export default function NotificationsModal({
  profile,
  modalVisible,
  closeModal,
}: Props) {
  const [loading, setLoading] = useState(true)
  const [edges, setEdges] = useState<NotificationEdge[]>([])
  const [pageInfo, setPageInfo] = useState<PageInfo>()

  const unreadNotifications = useMemo(
    () =>
      edges
        .filter((edge) => edge?.node?.status === "unread")
        .map((edge) => edge?.node?.id!),
    [edges]
  )

  const [isPending, startTransition] = useTransition()

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await fetch(`/api/notifications`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cusor: "",
        }),
      })
      const data = (await res.json()) as {
        result: FetchNotificationsResponse
      }

      setEdges(data.result?.edges)
      setPageInfo(data.result?.pageInfo)
      setLoading(false)
    } catch (error) {
      setLoading(false)
    }
  }, [])
  useSubscribeToNotifications(fetchNotifications, profile?.id)

  const fetchMore = useCallback(async () => {
    if (!pageInfo || !pageInfo.endCursor || !pageInfo.hasNextPage) return

    try {
      setLoading(true)
      const res = await fetch(`/api/notifications`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          publishType: "all",
          cursor: pageInfo.endCursor,
        }),
      })
      const data = (await res.json()) as {
        result: FetchNotificationsResponse
      }
      setEdges((prev) => combineEdges(prev, data?.result?.edges))
      setPageInfo(data?.result?.pageInfo)
      setLoading(false)
    } catch (error) {
      setLoading(false)
    }
  }, [pageInfo])
  const { observedRef } = useInfiniteScroll(0.5, fetchMore)

  const updateStatus = useCallback((ids: string[]) => {
    startTransition(() => updateNotificationReadStatus(ids))
  }, [])

  // Update notifications status when the modal is open
  useEffect(() => {
    if (modalVisible && unreadNotifications.length > 0) {
      updateStatus(unreadNotifications)
    }
  }, [unreadNotifications, updateStatus, modalVisible])

  return (
    <ModalWrapper visible={modalVisible} backdropZIndex="z-40">
      <div className="fixed z-50 top-[20px] left-[10px] sm:left-auto right-[10px] sm:right-[50px] bottom-[20px] sm:w-[400px] bg-white rounded-md overflow-hidden shadow-md flex flex-col">
        <div className="w-full px-4 py-2 flex items-center justify-between border-b border-neutral-200">
          <h6>Notifications</h6>
          <div className="px-2">
            <button
              type="button"
              className="text-xl text-textLight"
              onClick={closeModal}
            >
              &#10005;
            </button>
          </div>
        </div>
        <div className="flex-grow h-full flex items-center justify-center">
          {loading ? (
            <ButtonLoader loading={loading} color="#d4d4d4" />
          ) : edges.length === 0 ? (
            <h6 className="text-lg text-textLight">{`You don't have notifications.`}</h6>
          ) : (
            <div className="h-full flex flex-col gap-y-2 px-2 pt-2 pb-20 overflow-y-auto">
              {edges.map((edge) =>
                !edge?.node ? null : (
                  <div
                    key={edge.node.id}
                    className={`py-2 px-4 cursor-pointer ${
                      edge.node.status === "read"
                        ? "bg-neutral-50 hover:bg-neutral-100"
                        : "bg-neutral-200 hover:bg-neutral-100"
                    } rounded-md flex items-center justify-between gap-x-3`}
                  >
                    <div className="h-full w-full flex items-center text-sm">
                      {edge.node.content}
                    </div>
                    <div className="h-full w-[100px] flex items-center text-xs text-textLight">
                      {calculateTimeElapsed(edge.node.createdAt)}
                    </div>
                  </div>
                )
              )}

              <div
                ref={observedRef}
                className="w-full h-4 flex items-center justify-center"
              >
                {loading && (
                  <ButtonLoader loading={loading} size={8} color="#d4d4d4" />
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </ModalWrapper>
  )
}
