"use client"

import React, { useState, useCallback, useTransition } from "react"
import { useRouter } from "next/navigation"
import { MdModeEditOutline } from "react-icons/md"
import { toast } from "react-toastify"

import Mask from "@/components/Mask"
import { useAuthContext } from "@/context/AuthContext"
import {
  updatePLName,
  updatePLDescription,
} from "@/app/actions/library-actions"

interface Props {
  playlistId?: string
  isAuthenticated: boolean
  name: string
  description?: string
  itemsCount: number
  isFullWidth?: boolean
}

export default function PlaylistName({
  playlistId,
  isAuthenticated,
  name,
  description,
  itemsCount,
  isFullWidth = true,
}: Props) {
  const [isEditingName, setIsEditingName] = useState(false)
  const [optimisticName, setOptimisticName] = useState(name)

  const [isEditingDescription, setIsEditingDescription] = useState(false)
  const [optimisticDescription, setOptimisticDescription] =
    useState(description)

  const { onVisible: openAuthModal } = useAuthContext()
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const startEditingName = useCallback(() => {
    setIsEditingName(true)
  }, [])

  const endEditingName = useCallback(() => {
    setIsEditingName(false)
  }, [])

  const startEditingDescription = useCallback(() => {
    setIsEditingDescription(true)
  }, [])

  const endEditingDescription = useCallback(() => {
    setIsEditingDescription(false)
  }, [])

  const confirmEditName = useCallback(() => {
    if (!playlistId) return

    if (!isAuthenticated) {
      openAuthModal()
    } else {
      const el = document.getElementById("playlist-name") as HTMLInputElement
      if (!el || !el.value || el.value.length < 1 || el.value.length > 120)
        return

      const newName = el.value
      if (newName === name) return

      setOptimisticName(newName)
      startTransition(() => updatePLName(playlistId, newName))
      toast.success("Updated playlist name", { theme: "dark" })
      endEditingName()
      router.refresh()
    }
  }, [name, playlistId, isAuthenticated, openAuthModal, endEditingName, router])

  const confirmEditDescription = useCallback(() => {
    if (!playlistId) return

    if (!isAuthenticated) {
      openAuthModal()
    } else {
      const el = document.getElementById(
        "playlist-description"
      ) as HTMLInputElement
      if (!el || el.value?.length > 2000) return

      const newDescription = el.value
      if (newDescription === description) return

      setOptimisticDescription(newDescription)
      startTransition(() => updatePLDescription(playlistId, newDescription))
      toast.success("Updated playlist description", { theme: "dark" })
      endEditingDescription()
    }
  }, [
    description,
    playlistId,
    isAuthenticated,
    openAuthModal,
    endEditingDescription,
  ])

  return (
    <>
      <div className="w-full">
        {!isEditingName ? (
          <div
            className={`${
              isFullWidth ? "w-full" : "sm:w-[40%] md:w-[30%]"
            } flex items-start justify-between ${
              !itemsCount ? "px-2 sm:px-0" : ""
            }`}
          >
            <h6 className="text-lg sm:text-xl">{optimisticName}</h6>
            {name !== "Watch later" && name !== "Reading list" && (
              <MdModeEditOutline
                size={20}
                className="cursor-pointer"
                onClick={startEditingName}
              />
            )}
          </div>
        ) : (
          <div
            className={
              isFullWidth
                ? "w-full px-2 sm:px-0"
                : "px-2 sm:px-0 sm:w-[40%] md:w-[30%]"
            }
          >
            <input
              id="playlist-name"
              type="text"
              defaultValue={optimisticName}
              minLength={1}
              maxLength={120}
              className="block w-full font-semibold text-lg rounded-none sm:text-xl bg-transparent border-b-[2px] border-neutral-700"
            />
            <div className="flex items-center justify-end gap-x-4">
              <button
                type="button"
                className="mx-0 px-5 error font-semibold text-sm"
                onClick={endEditingName}
              >
                Cancel
              </button>
              <button
                type="button"
                className="mx-0 px-5 font-semibold text-sm"
                onClick={confirmEditName}
              >
                Save
              </button>
            </div>
          </div>
        )}
      </div>
      {name !== "Watch later" && name !== "Reading list" && itemsCount > 0 && (
        <div className="mt-1">
          {!isEditingDescription ? (
            <div className="flex items-start justify-between">
              <p>{optimisticDescription || "No description"}</p>
              <MdModeEditOutline
                size={16}
                className="cursor-pointer"
                onClick={startEditingDescription}
              />
            </div>
          ) : (
            <div className="w-full">
              <input
                id="playlist-description"
                type="text"
                maxLength={2000}
                defaultValue={optimisticDescription}
                placeholder={!optimisticDescription ? "Description" : ""}
                className="block w-full bg-transparent border-b-[2px] border-neutral-700"
              />
              <div className="flex items-center justify-end gap-x-4">
                <button
                  type="button"
                  className="mx-0 px-5 font-semibold text-sm"
                  onClick={endEditingDescription}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="mx-0 px-5 font-semibold text-sm"
                  onClick={confirmEditDescription}
                >
                  Save
                </button>
              </div>
            </div>
          )}
        </div>
      )}
      {!itemsCount && (
        <p className="mt-1 px-2 sm:px-0 text-textLight">
          No items in this playlist.
        </p>
      )}

      {/* Prevent user interaction while loading */}
      {isPending && <Mask />}
    </>
  )
}
