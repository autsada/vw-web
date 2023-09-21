import _ from "lodash"

import type {
  CheckPublishPlaylistsResponse,
  PlaylistEdge,
} from "@/graphql/codegen/graphql"

// Transform seconds to hour format
export function secondsToHourFormat(sec: number) {
  const h = Math.floor(sec / 3600)
    .toString()
    .padStart(1, "0")
  const H = h === "0" ? "" : `${h}:`

  const m = Math.floor((sec % 3600) / 60)
    .toString()
    .padStart(2, "0")
  const M =
    m === "00" ? "0:" : m.startsWith("0") ? `${m.replace("0", "")}:` : `${m}:`

  const s = Math.floor(sec % 60)
    .toString()
    .padStart(2, "0")

  return `${H}${M}${s}`
}

export function formatDate(date: Date) {
  const usDateTime = date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    // hour: "numeric",
    // minute: "numeric",
    // hour12: true,
    // timeZone: 'America/Los_Angeles',
  })

  const [d1, d2, d3] = usDateTime.split(", ")

  const formattedUsDateTime = `${d1}, ${d2}`

  return formattedUsDateTime
}

export function getPostExcerpt(str: string, len = 100) {
  return _.truncate(str, { length: len, separator: /,?\.* +/ }) // separate by spaces, including preceding commas and periods
}

export function calculateTimeElapsed(time: string) {
  if (!time) return null

  const startTime = new Date(time)
  const endTime = new Date()

  const timeDiff = Math.abs((startTime as any) - (endTime as any)) / 1000 // seconds

  // 1 min = 60 secs
  // 1 hr = 3600 secs
  // 1 day = 86400 secs
  const min = 60

  if (timeDiff <= 1) {
    // Less than 1 second

    return `Just now`
  } else if (timeDiff < min) {
    // Less than 1 minute
    const elapse = Math.round(timeDiff / min)

    return `${elapse} seconds ago`
  } else if (timeDiff < min * 60) {
    // Less than 1 hour
    const elapse = Math.round(timeDiff / min)

    return `${elapse} ${elapse > 1 ? "minutes" : "minute"} ago`
  } else if (timeDiff < min * 60 * 24) {
    // Less than 1 day
    const elapse = Math.round(timeDiff / (min * 60))

    return `${elapse} ${elapse > 1 ? "hours" : "hour"} ago`
  } else if (timeDiff < min * 60 * 24 * 7) {
    // Less than 1 week
    const elapse = Math.round(timeDiff / (min * 60 * 24))

    return `${elapse} ${elapse > 1 ? "days" : "day"} ago`
  } else if (timeDiff < min * 60 * 24 * 7 * 4) {
    // Less than 1 month
    const elapse = Math.round(timeDiff / (min * 60 * 24 * 7))

    return `${elapse} ${elapse > 1 ? "weeks" : "week"} ago`
  } else if (timeDiff < min * 60 * 24 * 7 * 4 * 12) {
    // Less than 1 year
    const elapse = Math.round(timeDiff / (min * 60 * 24 * 7 * 4))

    return `${elapse} ${elapse > 1 ? "months" : "month"} ago`
  } else {
    // More than 1 year
    const elapse = Math.round(timeDiff / (min * 60 * 24 * 7 * 4 * 12))

    return `${elapse} ${elapse > 1 ? "years" : "year"} ago`
  }
}

export function transformPlaylists(
  // playlists: FetchPlaylistsResponse | undefined,
  playlists: PlaylistEdge[],
  data: CheckPublishPlaylistsResponse | undefined
) {
  return !playlists
    ? []
    : playlists.map((pl) => {
        const isInPlaylist = !data
          ? undefined
          : data.items
              .map((item) => item?.playlist?.id)
              .includes(pl.node?.id || "")
        return {
          isInPlaylist,
          list: pl.node,
        }
      })
}

export function formatAmount(amount: number, withSign: boolean = false) {
  const formatter = new Intl.NumberFormat("en-US", {
    style: withSign ? "currency" : undefined,
    currency: "USD",
    maximumFractionDigits: 0,
  })

  if (typeof amount === "boolean" || isNaN(amount)) return "$0.00"

  return formatter.format(+amount)
}

/**
 * A function to call an upload video route in the Upload Service to upload a video
 */
export function uploadVideo({
  idToken,
  file,
  publishId,
  profileName,
}: {
  idToken: string
  file: File
  publishId: string
  profileName: string
}) {
  const uploadURL =
    process.env.NEXT_PUBLIC_UPLOAD_URL || "http://localhost:4444"
  // const uploadURL =
  //   process.env.NEXT_PUBLIC_UPLOAD_URL ||
  //   "https://a719-27-55-71-6.ngrok-free.app"

  const formData = new FormData()
  formData.append("file", file!)
  formData.append("publishId", publishId)
  formData.append("profileName", profileName)

  return fetch(`${uploadURL}/upload/video`, {
    method: "POST",
    headers: {
      "id-token": idToken,
    },
    body: formData,
  })
}

/**
 * A function to call an upload image route in the Upload Service to upload a profile image
 */
export function uploadImage({
  idToken,
  file,
  profileName,
}: {
  idToken: string
  file: File
  profileName: string
}) {
  const uploadURL =
    process.env.NEXT_PUBLIC_UPLOAD_URL || "http://localhost:4444"

  const formData = new FormData()
  formData.append("file", file!)
  formData.append("profileName", profileName)

  return fetch(`${uploadURL}/upload/image`, {
    method: "POST",
    headers: {
      "id-token": idToken,
    },
    body: formData,
  })
}
