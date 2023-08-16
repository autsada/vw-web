import React, { ChangeEvent, FormEvent, useState } from "react"
import { sendSignInLinkToEmail } from "firebase/auth"

import EmailInput from "./EmailInput"
import Mask from "../Mask"
import ButtonLoader from "../ButtonLoader"
import { firebaseAuth } from "@/firebase/config"
import { EMAIL_KEY } from "@/lib/constants"

export default function EmailAuth() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [isError, setIsError] = useState(false)
  const [isSent, setIsSent] = useState(false)

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    setEmail(e.target.value)
    if (isSuccess) setIsSuccess(false)
    if (isError) setIsError(false)
  }

  async function sendSignInLink(email: string) {
    const url = process.env.NEXT_PUBLIC_VW_URL_TEST || "http://localhost:3000"
    // const url =
    //   process.env.NEXT_PUBLIC_VW_URL_TEST ||
    //   "https://a2df-27-55-71-6.ngrok-free.app"

    const actionCodeSettings = {
      url: `${url}/auth/email/verify`,
      // This must be true.
      handleCodeInApp: true,
      // iOS: {
      //   bundleId: "com.example.ios",
      // },
      // android: {
      //   packageName: "com.example.android",
      //   installApp: true,
      //   minimumVersion: "12",
      // },
      // dynamicLinkDomain: "example.page.link",
    }

    await sendSignInLinkToEmail(firebaseAuth, email, actionCodeSettings)

    // The link was successfully sent. Inform the user.
    // Save the email locally so you don't need to ask the user for it again
    // if they open the link on the same device.
    window?.localStorage.setItem(EMAIL_KEY, email)
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    if (typeof window === "undefined") return

    e.preventDefault()

    try {
      setLoading(true)
      if (isError) setIsError(false)
      await sendSignInLink(email)
      setIsSent(true)
      setLoading(false)
      setIsSuccess(true)
    } catch (error) {
      setIsSent(false)
      setLoading(false)
      setIsError(true)
      if (isSuccess) setIsSuccess(false)
    }
  }

  return (
    <>
      <div className="mt-8 py-5 text-center">
        <h4>Sign in with Email</h4>
      </div>

      <form className="mt-5 px-10 sm:px-14" onSubmit={handleSubmit}>
        <EmailInput
          placeholder="Email address"
          handleChange={handleChange}
          value={email}
          disabled={loading}
        />

        <div className="my-10 h-[50px] px-1 flex items-center justify-center">
          {isError && !loading ? (
            <p className="error font-normal text-base text-center">
              Error occurred while attempting to send a sign-in link to your
              email. Please try again.
            </p>
          ) : isSent ? (
            <h6 className="text-center text-lg text-blueBase">
              We have sent you a sign-in link, please check your email.
            </h6>
          ) : (
            <p className="font-light text-center text-lg text-blueBase">
              We will send a sign-in link to your email.
            </p>
          )}
        </div>

        <button
          type="submit"
          className={`btn-orange w-full h-12 rounded-full text-lg ${
            !email || loading || isSuccess ? "opacity-20" : "opacity-100"
          }`}
          disabled={!email || loading || isSuccess}
        >
          {loading ? <ButtonLoader loading /> : "Get Link"}
        </button>
      </form>

      {/* Prevent user interaction while loading */}
      {loading && <Mask />}
    </>
  )
}
