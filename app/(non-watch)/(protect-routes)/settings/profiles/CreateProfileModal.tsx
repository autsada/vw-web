import React, {
  useState,
  ChangeEvent,
  useCallback,
  FormEvent,
  useMemo,
  useEffect,
} from "react"
import { useRouter } from "next/navigation"
import _ from "lodash"

import CloseButton from "@/components/CloseButton"
import NameInput from "./NameInput"
import ButtonLoader from "@/components/ButtonLoader"
import Mask from "@/components/Mask"
import ModalWrapper from "@/components/ModalWrapper"
import type { Account } from "@/graphql/codegen/graphql"
import { PROFILE_KEY } from "@/lib/constants"

interface Props {
  closeModal: () => void
  title?: string
  additionalInfo?: string
  useDoItLaterClose?: boolean
  doItLaterText?: string
}

export default function CreateProfileModal({
  closeModal,
  title = "Create Profile",
  additionalInfo,
  useDoItLaterClose = false,
  doItLaterText = "",
}: Props) {
  const [name, setName] = useState("")
  const [nameError, setNameError] = useState("")
  const [isNameValid, setIsNameValid] = useState<boolean>()
  const [loading, setLoading] = useState(false)
  const [isError, setIsError] = useState(false)

  const router = useRouter()

  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value
    setName(v)
    if (v.length < 3) {
      setNameError("At least 3 characters")
    } else if (v.length > 64) {
      setNameError("Too long")
    } else {
      setNameError("")
    }
  }, [])

  const validateName = useCallback(async (n: string) => {
    const result = await fetch(`/api/profile/validateName`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: n }),
    })

    const data = await result.json()
    setIsNameValid(data?.valid)
  }, [])

  const validateNameDebounce = useMemo(
    () => _.debounce(validateName, 200),
    [validateName]
  )

  useEffect(() => {
    if (name && !nameError) {
      validateNameDebounce(name)
    }
  }, [name, nameError, validateNameDebounce])

  const onCreate = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault()

      if (!isNameValid || !name || name.length < 3 || name.length > 64) return

      try {
        setLoading(true)
        await fetch(`/api/profile/create`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name }),
        })

        // Reload data to update the UI
        router.refresh()
        setLoading(false)
        // Write to local storage so if user opens the browser more than one tab, other tabs will be notified.
        window?.localStorage?.setItem(PROFILE_KEY, "profile_done")
        closeModal()
      } catch (error) {
        setLoading(false)
        setIsError(true)
      }
    },
    [name, isNameValid, closeModal, router]
  )

  return (
    <ModalWrapper visible withBackdrop>
      <div className="relative z-50 w-[90%] sm:w-[60%] md:w-[50%] lg:w-[35%] mx-auto px-10 pt-10 pb-6 bg-white rounded-xl text-center">
        {!useDoItLaterClose && (
          <div className="absolute top-2 right-4">
            <CloseButton onClick={closeModal} className="text-base" />
          </div>
        )}
        <h4 className="text-2xl sm:text-3xl">{title}</h4>
        {additionalInfo && <p className="pt-2">{additionalInfo}</p>}

        <form onSubmit={onCreate}>
          <div className="my-5">
            <NameInput
              name="Name"
              placeholder=""
              value={name}
              onChange={handleChange}
              error={
                nameError ||
                (typeof isNameValid === "boolean" && !isNameValid
                  ? "This name is taken"
                  : "")
              }
              isMandatory={true}
              valid={isNameValid}
            />
          </div>

          <button
            type="submit"
            className={`btn-dark w-full rounded-full ${
              nameError || !isNameValid
                ? "opacity-30 cursor-not-allowed"
                : "opacity-100"
            }`}
            disabled={!!nameError || !isNameValid || loading}
          >
            {loading ? <ButtonLoader loading /> : "Create"}
          </button>
          <p className="error">
            {isError ? "Create profile failed" : <>&nbsp;</>}
          </p>
        </form>
        {useDoItLaterClose && (
          <button onClick={closeModal} className="w-full text-blueBase">
            {doItLaterText || "Maybe later"}
          </button>
        )}
      </div>
      {loading && <Mask />}
    </ModalWrapper>
  )
}
