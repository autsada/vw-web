import React, { useEffect, useCallback, useState } from "react"
import { Web3Button } from "@web3modal/react"
import { useAccount, useSignMessage, useDisconnect } from "wagmi"
import { setCookie } from "cookies-next"
import { signInAnonymously } from "firebase/auth"
import { useRouter } from "next/navigation"

import PageLoader from "../PageLoader"
import { firebaseAuth } from "@/firebase/config"
import { MESSAGE } from "@/lib/constants"
import { wait } from "@/lib/helpers"

interface Props {
  closeModal: () => void
}

export default function WalletAuth({ closeModal }: Props) {
  const [loading, setLoading] = useState(false)

  const router = useRouter()
  const { isConnected } = useAccount()
  const { disconnect } = useDisconnect()
  const { signMessage } = useSignMessage({
    onSuccess: async (data, variables) => {
      // Sign in with Firebase auth when sign message is done
      await signIn()
      setCookie("dsignature", data)
      await wait(500)
      router.refresh()
      router.push("/profile")
    },
    onError: () => {
      disconnect()
      closeModal()
    },
  })

  const signIn = useCallback(async () => {
    if (!signMessage) return
    try {
      setLoading(true)
      // // Set auth state persistance to session
      // await firebaseAuth.setPersistence(browserSessionPersistence)
      // Sign in anonymously with Firebase auth
      await signInAnonymously(firebaseAuth)
    } catch (error) {
      setLoading(false)
      if (disconnect) disconnect()
    }
  }, [signMessage, disconnect])

  const signOut = useCallback(async () => {
    try {
      setLoading(true)
      await firebaseAuth.signOut()
      setLoading(false)
    } catch (error) {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (isConnected) {
      signMessage({ message: MESSAGE })
    } else {
      signOut()
    }
  }, [isConnected, signMessage, signOut])

  return (
    <>
      <div className="mt-8 py-5 text-center">
        <h4>Sign in with Wallet</h4>
      </div>

      <div className="mt-5 px-10 sm:px-14 text-center">
        <Web3Button icon="hide" />
      </div>

      {loading && <PageLoader />}
    </>
  )
}
