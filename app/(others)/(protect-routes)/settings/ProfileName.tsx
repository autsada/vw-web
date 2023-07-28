"use client"

import _ from "lodash"
import React, { useState, useCallback, useTransition } from "react"
import { MdModeEditOutline } from "react-icons/md"

import Mask from "@/components/Mask"
import { updateDisplayName } from "@/app/actions/profile-actions"
import type { Profile } from "@/graphql/codegen/graphql"

interface Props {
  profile: Profile
}

export default function ProfileName({ profile }: Props) {
  const name = profile?.name || ""
  const displayName = profile?.displayName || ""
  const [optimisticName, setOptimisticName] = useState(displayName)

  const [isEditing, setIsEditing] = useState(false)
  const [error, setError] = useState("")

  const [isPending, startTransition] = useTransition()

  const toggleEditing = useCallback(() => {
    setIsEditing(!isEditing)
    const el = document.getElementById("display-name") as HTMLInputElement
    if (!isEditing) {
      if (el) {
        el.focus()
      }
    } else {
      setError("")
      if (el) {
        el.value = el.defaultValue
      }
    }
  }, [isEditing])

  const cancelEditing = useCallback(() => {
    setIsEditing(false)
    setError("")
    const el = document.getElementById("display-name") as HTMLInputElement
    if (el) {
      el.value = el.defaultValue
    }
  }, [])

  const saveEditing = useCallback(async () => {
    try {
      // Get the value
      const el = document?.getElementById("display-name") as HTMLInputElement
      if (!el || !el.value) {
        setError("Required")
      } else {
        const value = el.value
        if (optimisticName === value) return

        // Update the name
        setOptimisticName(value)
        startTransition(() => updateDisplayName(value))
        setIsEditing(false)
        setError("")
      }
    } catch (error) {
      setError("Try again.")
    }
  }, [optimisticName])

  return (
    <>
      <div className="mb-5">
        <div className="flex items-start">
          <h6 className="text-base">Name</h6>
        </div>
        <div className="px-2">
          <p className="text-base">@{name}</p>
        </div>
      </div>

      <div className="mb-5">
        <div className="flex items-start gap-x-5">
          <h6 className="text-base">Display name</h6>
          <div className="cursor-pointer px-2">
            <MdModeEditOutline
              color="black"
              className="text-base"
              onClick={toggleEditing}
            />
          </div>
        </div>
        <div className="px-2">
          <p className={`${isEditing ? "hidden" : "block"} text-base`}>
            {optimisticName}
          </p>
          <div className={`${isEditing ? "block" : "hidden"} relative w-full`}>
            <input
              id="display-name"
              type="text"
              defaultValue={optimisticName}
              className="w-full text-textLight rounded-none border-b-[2px] border-neutral-700"
            />
            {error && (
              <p className="absolute bottom-5 error text-xs">{error}</p>
            )}
            <div className="w-full flex items-center justify-end gap-x-4">
              <button
                type="button"
                className="error mx-0 font-semibold px-4"
                onClick={cancelEditing}
              >
                Cancel
              </button>
              <button
                type="button"
                className="error mx-0 font-semibold px-4 text-textRegular"
                onClick={saveEditing}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Prevent interaction while loading */}
      {isPending && <Mask />}
    </>
  )
}
