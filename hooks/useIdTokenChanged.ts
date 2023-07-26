import { useEffect, useState } from "react"
import { setCookie, deleteCookie } from "cookies-next"
import { useRouter } from "next/navigation"

import { firebaseAuth } from "@/firebase/config"
import { PROFILE_KEY } from "@/lib/constants"

export function useIdTokenChanged() {
  const [idToken, setIdToken] = useState<string>()

  const router = useRouter()

  // When id token changed
  useEffect(() => {
    const unsubscribe = firebaseAuth.onIdTokenChanged(async (user) => {
      if (user) {
        const token = await user.getIdToken()
        setIdToken(token)
        setCookie("dtoken", token)
      } else {
        setIdToken(undefined)
        deleteCookie("dtoken")
        deleteCookie("dsignature")
        // Reload data to logged user out
        router.refresh()
      }
    })

    return unsubscribe
  }, [router])

  // Listen to localstorage change in order to refresh the UI
  useEffect(() => {
    if (typeof window === "undefined") return
    const onStorageChanged = () => {
      const key = window?.localStorage?.getItem(PROFILE_KEY)
      if (key) {
        router.refresh()
        // Remove local storage
        window?.localStorage?.removeItem(PROFILE_KEY)
      }
    }

    window.addEventListener("storage", onStorageChanged)

    return () => {
      window.removeEventListener("storage", onStorageChanged)
    }
  }, [router])

  return { idToken }
}
