"use client"

import React, { useCallback, useState, useTransition } from "react"
import _ from "lodash"

import Mask from "@/components/Mask"
import ButtonLoader from "@/components/ButtonLoader"
import { contentCategories } from "@/lib/helpers"
import { updateUserWatchPreferences } from "@/app/actions/profile-actions"
import type { PublishCategory } from "@/graphql/types"

interface Props {
  preferences: PublishCategory[]
}

export default function WatchPreferences({ preferences }: Props) {
  const [prevPreferences, setPrevPreferences] = useState(preferences)
  const [selectedPreferences, setSelectedPreferences] = useState(preferences)
  if (preferences !== prevPreferences) {
    setPrevPreferences(preferences)
    setSelectedPreferences(preferences)
  }

  const isChanged = !_.isEqual(prevPreferences, selectedPreferences)
  const [isPending, startTransition] = useTransition()

  const toggleSelect = useCallback((cat: PublishCategory) => {
    setSelectedPreferences((prev) =>
      prev.includes(cat)
        ? prev.filter((c) => c !== cat)
        : prev.length < 10
        ? [...prev, cat]
        : prev
    )
  }, [])

  const confirmUpdate = useCallback(() => {
    if (!isChanged) return

    startTransition(() => updateUserWatchPreferences(selectedPreferences))
  }, [isChanged, selectedPreferences])

  const cancelUpdate = useCallback(() => {
    setSelectedPreferences(preferences)
  }, [preferences])

  return (
    <>
      <div className="w-full flex flex-wrap justify-start gap-x-3 sm:gap-x-5 gap-y-5">
        {contentCategories.map((cat) => (
          <Topic
            key={cat}
            cat={cat}
            isSelected={selectedPreferences.includes(cat)}
            selectTopic={toggleSelect}
          />
        ))}
      </div>

      {isChanged && (
        <div className="mt-5 flex items-center justify-between">
          <div className="pl-2">
            <p className="text-center font-semibold">
              {selectedPreferences.length > 0 ? (
                `${selectedPreferences.length} Selected`
              ) : (
                <>&nbsp;</>
              )}
            </p>
          </div>
          <div className="flex items-center justify-end gap-x-5">
            <button
              type="submit"
              className="btn-cancel mx-0 px-5 rounded-full"
              onClick={cancelUpdate}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-blue mx-0 w-[90px] rounded-full"
              onClick={confirmUpdate}
            >
              {isPending ? <ButtonLoader loading /> : "Save"}
            </button>
          </div>
        </div>
      )}

      {isPending && <Mask />}
    </>
  )
}

function Topic({
  cat,
  isSelected,
  selectTopic,
}: {
  cat: PublishCategory
  isSelected: boolean
  selectTopic: (cat: PublishCategory) => void
}) {
  return (
    <button
      type="button"
      className={`${
        isSelected ? "btn-dark" : "btn-light"
      } mx-0 px-5 rounded-full`}
      onClick={selectTopic.bind(undefined, cat)}
    >
      {cat}
    </button>
  )
}
