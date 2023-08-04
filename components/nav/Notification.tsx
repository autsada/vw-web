import React, { useState, useCallback } from "react"
import { IoNotificationsOutline } from "react-icons/io5"

import { useSubscribeToNotifications } from "@/hooks/useSubscribe"
import type {
  GetUnReadNotificationsResponse,
  Maybe,
  Profile,
} from "@/graphql/codegen/graphql"

interface Props {
  profile: Maybe<Profile> | undefined
  isWatchPage: boolean
  onClick: () => void
  unReadCount: Maybe<GetUnReadNotificationsResponse> | undefined
}

export default function Notification({
  profile,
  isWatchPage,
  onClick,
  unReadCount,
}: Props) {
  const [unRead, setUnRead] = useState(unReadCount?.unread)

  const reloadUnRead = useCallback(async () => {
    try {
      const res = await fetch(`/api/notifications/unread`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
      const data = (await res.json()) as {
        result: GetUnReadNotificationsResponse
      }

      setUnRead(data.result?.unread)
    } catch (error) {
      setUnRead((prev) => prev)
    }
  }, [])
  useSubscribeToNotifications(reloadUnRead, profile?.id)

  return (
    <div className="relative cursor-pointer" onClick={onClick}>
      <IoNotificationsOutline
        className={`text-2xl md:text-3xl ${
          isWatchPage ? "text-white" : "text-textExtraLight"
        }`}
      />
      {!!unRead && (
        <div className="absolute -top-2 -right-1 w-[18px] h-[18px] rounded-full flex items-center justify-center text-[8px] bg-error text-white">
          {unRead}
        </div>
      )}
    </div>
  )
}
