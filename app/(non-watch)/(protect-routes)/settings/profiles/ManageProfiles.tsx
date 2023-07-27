"use client"

import React, { useState, useCallback } from "react"
import { useRouter } from "next/navigation"

import Profile from "./Profile"
import CreateProfileModal from "./CreateProfileModal"
import ConfirmModal from "@/components/ConfirmModal"
import Mask from "@/components/Mask"
import type { Account } from "@/graphql/codegen/graphql"

interface Props {
  account: Account
  defaultProfileId: string
}

// TODO: Change from using api route to server action
export default function ManageProfiles({ account, defaultProfileId }: Props) {
  const [modalVisible, setModalVisible] = useState(!defaultProfileId)
  const [switchToId, setSwitchToId] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const profiles = account?.profiles

  const router = useRouter()

  const openModal = useCallback(() => {
    setModalVisible(true)
  }, [])

  const closeModal = useCallback(() => {
    if (!defaultProfileId) {
      router.back()
    } else {
      setModalVisible(false)
    }
  }, [defaultProfileId, router])

  const onRequestToSwitch = useCallback((id: string) => {
    setSwitchToId(id)
  }, [])

  const onCancelSwitch = useCallback(() => {
    setSwitchToId("")
  }, [])

  const confirmSwitchProfile = useCallback(async () => {
    if (!switchToId) return

    try {
      setLoading(true)
      const result = await fetch(`/api/profile/switch`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ profileId: switchToId }),
      })

      const data = await result.json()
      if (data?.status === "Ok") {
        // Reload data
        router.refresh()
        if (error) setError("")
        setLoading(false)
        setSwitchToId("")
      }
    } catch (error) {
      setLoading(false)
      setError("Switch profile failed")
    }
  }, [switchToId, error, router])

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-y-5 lg:gap-y-0">
        <div className="col-span-1 lg:col-span-2">
          <button
            className="btn-blue px-5 mx-0 rounded-full"
            onClick={openModal}
          >
            Create new profile
          </button>
        </div>

        <div className="lg:col-span-3">
          {profiles.length > 0 ? (
            <>
              <h6 className="text-base">Your profiles</h6>
              <div className="mt-2 divide-y">
                {profiles.map((profile) => (
                  <Profile
                    key={profile.id}
                    profile={profile}
                    defaultId={defaultProfileId}
                    onRequestToSwitchProfile={onRequestToSwitch}
                  />
                ))}
              </div>
            </>
          ) : (
            <p className="text-textLight">You don&apos;t have any profiles.</p>
          )}
        </div>
      </div>

      {modalVisible && <CreateProfileModal closeModal={closeModal} />}

      {switchToId && (
        <ConfirmModal
          onCancel={onCancelSwitch}
          onConfirm={confirmSwitchProfile}
          loading={loading}
          error={error}
        >
          <h6>Switch profile?</h6>
        </ConfirmModal>
      )}

      {loading && <Mask />}
    </>
  )
}
