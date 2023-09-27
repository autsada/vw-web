import { useEffect } from "react"
import { onSnapshot, doc } from "firebase/firestore"
import { useRouter } from "next/navigation"

import {
  db,
  updatesCollection,
  notificationsCollection,
  addressesCollection,
} from "@/firebase/config"

export function useSubscribeToUpdates(identifier?: string) {
  const router = useRouter()

  // Listen to the `updates` collection in Firestore
  useEffect(() => {
    if (!identifier) return

    const unsubscribe = onSnapshot(
      doc(db, updatesCollection, identifier),
      (doc) => {
        // Reload data to get the most updated publish
        router.refresh()
      }
    )
    return unsubscribe
  }, [router, identifier])
}

export function useSubscribeToNotifications(
  callback: () => void,
  identifier?: string
) {
  // Listen to the `notifications` collection in Firestore
  useEffect(() => {
    if (!identifier) return

    const unsubscribe = onSnapshot(
      doc(db, notificationsCollection, identifier),
      (doc) => {
        callback()
      }
    )
    return unsubscribe
  }, [identifier, callback])
}

export function useSubscribeToAddress(identifier?: string) {
  const router = useRouter()

  // Listen to the `updates` collection in Firestore
  useEffect(() => {
    if (!identifier) return

    const unsubscribe = onSnapshot(
      doc(db, addressesCollection, identifier),
      (doc) => {
        // Reload data to get the most updated publish
        router.refresh()
      }
    )
    return unsubscribe
  }, [router, identifier])
}
