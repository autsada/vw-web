"use client"

import React, { useState, useEffect, useCallback, ChangeEvent } from "react"
import { signInWithEmailLink, isSignInWithEmailLink } from "firebase/auth"
import { firebaseAuth } from "@/firebase/config"

import PageLoaderWithInfo from "@/components/PageLoaderWithInfo"
import ModalWrapper from "@/components/ModalWrapper"
import EmailInput from "@/components/auth/EmailInput"
import PageLoader from "@/components/PageLoader"
import ButtonLoader from "@/components/ButtonLoader"
import { useRouter } from "next/navigation"
import { wait } from "@/lib/helpers"
import { EMAIL_KEY } from "@/lib/constants"

/**
 * @dev Verify user's email
 * For email signin, when user clicks the sign-in link they will be brought back to this route to verify their email.
 */
export default function VerifyEmail() {
  const savedEmail =
    typeof window !== "undefined"
      ? window?.localStorage?.getItem(EMAIL_KEY)
      : undefined
  const href = typeof window !== "undefined" ? window?.location?.href : ""

  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(() => !!savedEmail)
  const [isError, setIsError] = useState(false)

  const router = useRouter()

  const onEmailChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
  }, [])

  const verifyEmail = useCallback(
    async (email: string, link: string) => {
      try {
        setLoading(true)
        const isLink = isSignInWithEmailLink(firebaseAuth, link)

        if (!isLink) {
          setIsError(true)
          setLoading(false)
        } else {
          await signInWithEmailLink(firebaseAuth, email, link)
          // Remove saved email in localstorage
          window?.localStorage?.removeItem(EMAIL_KEY)
          // Bring user to the home page, wait 0.5 second to make sure the cookie is set
          await wait(500)
          // Refresh queries
          router.refresh()
          setIsError(false)
          router.replace("/")
        }
      } catch (error) {
        setLoading(false)
        setIsError(true)
      }
    },
    [router]
  )

  // Start verifying right after the saved email found
  useEffect(() => {
    if (savedEmail && href) {
      verifyEmail(savedEmail, href)
    }
  }, [savedEmail, href, verifyEmail])

  // Clear states so user will be able to edit email
  const onEditEmail = useCallback(() => {
    setLoading(false)
    setIsError(false)
  }, [])

  if (loading || isError)
    return (
      <PageLoaderWithInfo loading={loading} loaderColor="#f97316">
        <div className="w-full text-center">
          {loading && <p className="text-lg">Verifying email...</p>}
          {isError && (
            <>
              <p className="error text-lg">Verify failed</p>

              <button
                type="button"
                className="mt-5 bg-gray-200 hover:bg-gray-100 px-6 rounded-full"
                onClick={onEditEmail}
              >
                Edit email
              </button>
            </>
          )}
        </div>
      </PageLoaderWithInfo>
    )

  return (
    <>
      <ModalWrapper visible>
        <form
          className="py-10 px-6 bg-white rounded-xl w-[90%] sm:w-[35%]"
          onSubmit={verifyEmail.bind(undefined, email, href!)}
        >
          <div className="text-center mb-10">
            <h5>Enter your email address</h5>
          </div>

          <div className="px-4 sm:px-10">
            <EmailInput
              placeholder="Email address"
              value={email}
              handleChange={onEmailChange}
              disabled={loading}
            />

            <button
              type="submit"
              className={`btn-orange w-full mt-10 mb-5 h-12 rounded-full text-lg ${
                !email || !href || loading ? "opacity-40" : "opacity-100"
              }`}
              disabled={!email || !href || loading}
            >
              {loading ? <ButtonLoader loading /> : "Verify"}
            </button>
          </div>
        </form>
      </ModalWrapper>

      {loading && <PageLoader />}
    </>
  )
}
