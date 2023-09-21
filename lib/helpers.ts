import { getCountries } from "react-phone-number-input/input"
import en from "react-phone-number-input/locale/en.json"
import type { Accept } from "react-dropzone"

import type {
  PublishEdge,
  CommentEdge,
  PlaylistEdge,
  PlaylistItemEdge,
  WatchLaterEdge,
  BookmarkEdge,
  NotificationEdge,
  FollowEdge,
} from "@/graphql/codegen/graphql"

export function getCountryNames() {
  return getCountries()
    .map((c) => ({ code: c, name: en[c] }))
    .sort((c1, c2) => {
      const c1Name = c1.name.toLowerCase()
      const c2Name = c2.name.toLowerCase()

      return c1Name > c2Name ? 1 : c1Name < c2Name ? -1 : 0
    })
}

/**
 * A helper function to wait
 * @param time milliseconds
 */
export function wait(time: number) {
  return new Promise((resolve) => setTimeout(resolve, time))
}

export const contentCategories = [
  "Music",
  "Movies",
  "Entertainment",
  "Sports",
  "Food",
  "Drinks",
  "Health",
  "Travel",
  "Gaming",
  "News",
  "Animals",
  "History",
  "Education",
  "Science",
  "Technology",
  "Programming",
  "AI",
  "Blockchain",
  "LifeStyle",
  "Vehicles",
  "Children",
  "Women",
  "Men",
  "Other",
] as const

export const publishTypes = [
  "videos",
  "shorts",
  "live",
  "blogs",
  "ads",
] as const

export function combineEdges<
  T extends
    | PublishEdge
    | CommentEdge
    | PlaylistEdge
    | PlaylistItemEdge
    | WatchLaterEdge
    | BookmarkEdge
    | NotificationEdge
    | FollowEdge
>(
  initialEdges: T[],
  newEdges: T[],
  stateHandlingMode?: "combine" | "no-combine" // "combine" = combine the previous and new state, "no-combine" = ignore the previous and use the new state only.
) {
  const edges = newEdges.filter(
    (newEdge) =>
      !initialEdges
        .map((edge) => edge?.node?.id || "")
        .includes(newEdge?.node?.id || "")
  )
  const allEdges =
    !stateHandlingMode || stateHandlingMode === "combine"
      ? [...initialEdges, ...edges]
      : newEdges

  return allEdges
}

export const dropzoneImageTypes: Accept = {
  image: [
    "image/*",
    // "image/jpeg",
    // "image/png",
    "image/heic",
    "image/heif",
  ],
}
