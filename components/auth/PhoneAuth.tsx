"use client"

import React, {
  ChangeEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react"
import PhoneInput, {
  getCountryCallingCode,
  isValidPhoneNumber,
} from "react-phone-number-input/input"
import _ from "lodash"
import { IoCaretDownOutline } from "react-icons/io5"
import type { Country } from "react-phone-number-input"
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth"
import { useRouter } from "next/navigation"
import type { ConfirmationResult } from "firebase/auth"

import { OtpInput } from "./OtpInput"
import Counter from "./Counter"
import Mask from "../Mask"
import PageLoader from "../PageLoader"
import { firebaseAuth } from "@/firebase/config"
import { getCountryNames, wait } from "@/lib/helpers"

export default function PhoneAuth() {
  const [country, setCountry] = useState<Country>("TH")
  const [phoneNumber, setPhoneNumber] = useState<string>()
  const [isNumberValid, setIsNumberValid] = useState(false)
  const [appVerifier, setAppVerifier] = useState<RecaptchaVerifier>()
  const [requestOtpLoading, setRequestOtpLoading] = useState(false)
  const [requestError, setRequestError] = useState("")
  const [timer, setTimer] = useState(0)
  const [isTimerDone, setIsTimerDone] = useState(false)
  const [confirmationResult, setConfirmationResult] =
    useState<ConfirmationResult>()
  const [isOtpSent, setIsOtpSent] = useState(false)
  const [userOtp, setUserOtp] = useState("")
  const [verifyOtpLoading, setVerifyOtpLoading] = useState(false)
  const [verifyError, setVerifyError] = useState("")

  const router = useRouter()

  function selectCountry(e: ChangeEvent<HTMLSelectElement>) {
    setCountry(e.target.value as Country)
  }

  const validatePhoneNumberDebounce = useMemo(
    () => _.debounce(validatePhoneNumber, 500),
    []
  )

  function validatePhoneNumber(phoneNumber: string, country: Country) {
    const valid = isValidPhoneNumber(phoneNumber, country)
    setIsNumberValid(valid)
  }

  // Validate phone number
  useEffect(() => {
    if (phoneNumber && country) {
      validatePhoneNumberDebounce(phoneNumber, country)
    }
  }, [phoneNumber, country, validatePhoneNumberDebounce])

  // When phone number is valid, blur the input
  useEffect(() => {
    if (isNumberValid) {
      const inputDivEl = document.getElementById("phone-input")
      if (inputDivEl) {
        const inputEl = inputDivEl.children[0] as HTMLInputElement
        if (inputEl) inputEl.blur()
      }
    }
  }, [isNumberValid])

  /**
   * @dev There are 2 steps to login with phone number.
   * 1. User request a verification code
   * 2. User enter and confirm the verification code they received
   */

  /**
   * The 1 step: Request OTP.
   */
  async function requestOtp() {
    try {
      if (!phoneNumber) throw new Error("Phone number is required.")

      // Start the process
      if (isOtpSent) setIsOtpSent(false)
      setRequestOtpLoading(true)
      if (requestError) setRequestError("")

      // Create a new recaptcha instance if not already
      const recaptchaVerifier = new RecaptchaVerifier(
        firebaseAuth,
        "sign-in-button",
        {
          size: "invisible",
          callback: async function () {
            // reCAPTCHA solved, allow signInWithPhoneNumber.
            // const confirmation = await signInWithPhoneNumber(
            //   firebaseAuth,
            //   phoneNumber,
            //   recaptchaVerifier
            // )
            // setConfirmationResult(confirmation)
            // setRequestOtpLoading(false)
            // setIsOtpSent(true)
          },
        }
      )

      // Store verifier for use in resend code function
      setAppVerifier(recaptchaVerifier)
      const confirmation = await signInWithPhoneNumber(
        firebaseAuth,
        phoneNumber,
        recaptchaVerifier
      )
      setConfirmationResult(confirmation)
      setRequestOtpLoading(false)
      setIsOtpSent(true)

      // Store the instance on the window object
      window.recaptchaVerifier = recaptchaVerifier
      const widgetId = await recaptchaVerifier.render()
      // Start timer to countdown before user can request to resend new otp
      setTimer(60)
      window.widgetId = widgetId
    } catch (error) {
      setRequestError("Error attempting to send OTP, please try again.")
      setRequestOtpLoading(false)
      if (isOtpSent) setIsOtpSent(false)

      // Reset the recaptcha so the user can try again
      if (window.grecaptcha) {
        window.grecaptcha.reset(window.widgetId)
      }
    }
  }

  /**
   * The 2 step: Verify OTP
   */
  const handleOtpChange = useCallback((value: string) => {
    setUserOtp(value)
  }, [])

  async function verifyOtp() {
    if (!confirmationResult || !userOtp || userOtp.length !== 6) return

    try {
      setVerifyOtpLoading(true)
      // Reset timer
      setTimer(0)
      setIsTimerDone(true)
      const result = await confirmationResult.confirm(userOtp)

      if (result.user) {
        // Wait 0.5 second to make sure the cookie is set
        await wait(500)

        // Check if this is a new user, if yes then create an account for this user
        await fetch(`/api/account/create`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        })

        // Refresh queries
        router.refresh()
        // Bring user to the profile page
        router.push("/profile")
      }
    } catch (error) {
      setVerifyOtpLoading(false)
      setVerifyError("Verify code failed")
    }
  }

  async function resendOtp() {
    try {
      if (!appVerifier || !isOtpSent) return
      if (!phoneNumber) {
        setRequestError("Phone number is required.")
        return
      }
      // Start the process
      setRequestOtpLoading(true)
      setIsTimerDone(false)

      const confirmation = await signInWithPhoneNumber(
        firebaseAuth,
        phoneNumber,
        appVerifier
      )
      setConfirmationResult(confirmation)
      setTimer(60)
      setRequestOtpLoading(false)
      if (requestError) setRequestError("")
    } catch (error) {
      setRequestError("Error attempting to send OTP, please try again.")
      setRequestOtpLoading(false)
      if (isOtpSent) setIsOtpSent(false)

      // Reset the recaptcha so the user can try again
      if (window.grecaptcha) {
        window.grecaptcha.reset(window.widgetId)
      }
    }
  }

  return (
    <>
      <div className="mt-8 py-5 text-center">
        <h4>Sign in with Phone</h4>
      </div>

      <div className="mt-5 px-10 sm:px-14">
        {/* Step 1 Request Code */}
        <div className="relative">
          <div className="border border-orangeBase rounded-lg">
            <div
              className={`relative px-4 h-12 flex items-center ${
                country ? "border-b border-orangeBase" : ""
              }`}
            >
              <select
                value={country}
                onChange={selectCountry}
                className="relative z-10 w-full bg-transparent text-lg font-semibold text-textDark cursor-pointer appearance-none focus:outline-none"
              >
                <Option value="" name="Select country" />
                {getCountryNames().map((c) => (
                  <Option
                    key={c.code}
                    value={c.code as Country}
                    name={c.name}
                  />
                ))}
              </select>
              <IoCaretDownOutline
                color="#525252"
                className="absolute z-0 right-4 cursor-pointer"
              />
            </div>
            {country && (
              <div className="h-12 px-2 flex items-center">
                <div className="h-full w-20 border-r border-orangeBase flex justify-center items-center">
                  <h6 className="text-lg text-textDark">
                    {country && `+${getCountryCallingCode(country)}`}
                  </h6>
                </div>
                <div id="phone-input" className="h-full flex-grow">
                  <PhoneInput
                    country={country}
                    defaultCountry="TH"
                    value={phoneNumber}
                    onChange={setPhoneNumber}
                    placeholder="Phone number"
                    className="w-full h-full leading-12 p-0 pl-4 appearance-none font-semibold text-textDark text-lg placeholder:font-extralight placeholder:text-textExtraLight focus:outline-none"
                  />
                </div>
              </div>
            )}
            {country && phoneNumber && (
              <p className="absolute font-thin text-sm pl-20 text-error">
                {!isNumberValid ? "Invalid number" : <>&nbsp;</>}
              </p>
            )}
          </div>

          <div className="my-6 h-[50px] px-1 flex items-center justify-center">
            {isNumberValid ? (
              isOtpSent ? (
                <h6 className="text-center text-lg text-blueBase">
                  A verification code sent.
                </h6>
              ) : requestOtpLoading ? (
                <p className="font-light text-center text-lg text-blueBase">
                  Sending a verification code
                </p>
              ) : (
                <p className="font-light text-center text-lg text-blueBase">
                  We will send you a 6-digits verification code.
                </p>
              )
            ) : (
              <p>&nbsp;</p>
            )}
          </div>

          <button
            id="sign-in-button"
            className={`btn-dark w-full h-12 rounded-full text-lg ${
              !isNumberValid || requestOtpLoading ? "opacity-10" : "opacity-100"
            }`}
            disabled={!isNumberValid || requestOtpLoading}
            onClick={
              !isOtpSent ? requestOtp : isTimerDone ? resendOtp : undefined
            }
          >
            {!isOtpSent ? (
              "Get Code"
            ) : isTimerDone ? (
              "Resend Code"
            ) : (
              <Counter initialTime={timer} setIsTimerDone={setIsTimerDone} />
            )}
          </button>
          <p className="error mt-1">
            {requestError ? requestError : <>&nbsp;</>}
          </p>

          {/* {isOtpSent && (
            <button
              className="absolute bottom-[80px] right-0 text-orange-500 px-4"
              disabled={!isNumberValid || requestOtpLoading}
              onClick={requestOtp}
            >
              Resend
            </button>
          )} */}
        </div>

        {/* Step 2 Confirm Code */}
        {isOtpSent && (
          <div className="pt-10">
            <div className="relative mb-12">
              <OtpInput
                value={userOtp}
                valueLen={6}
                onChange={handleOtpChange}
              />
            </div>

            <button
              id="sign-in-button"
              type="button"
              className={`btn-orange w-full mt-14 h-12 rounded-full text-lg ${
                requestOtpLoading || verifyOtpLoading
                  ? "opacity-30"
                  : "opacity-100"
              }`}
              disabled={
                requestOtpLoading ||
                !confirmationResult ||
                !userOtp ||
                userOtp.length !== 6 ||
                verifyOtpLoading
              }
              onClick={verifyOtp}
            >
              Verify Code
            </button>
            <p className="error font-light text-base">
              {verifyError ? verifyError : <>&nbsp;</>}
            </p>
          </div>
        )}
      </div>

      {/* Prevent user interaction while loading */}
      {(requestOtpLoading || verifyOtpLoading) && <Mask />}

      {/* Show page loader during account creation */}
      {verifyOtpLoading && <PageLoader />}
    </>
  )
}

function Option({ value, name }: { value: Country | ""; name: string }) {
  return (
    <option value={value} className="font-normal text-textRegular text-base">
      {name}
    </option>
  )
}
