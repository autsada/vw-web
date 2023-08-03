import { useEffect } from "react"
import { onSnapshot, doc } from "firebase/firestore"
import { useRouter } from "next/navigation"

import { db, updatesCollection } from "@/firebase/config"

export function useSubscribeToFirestore(identifier?: string) {
  const router = useRouter()

  // Listen to upload finished update in Firestore
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
