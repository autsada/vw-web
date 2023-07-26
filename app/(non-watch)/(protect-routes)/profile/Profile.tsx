"use client"

import React, { useCallback, useState } from "react"
import { useRouter } from "next/navigation"

import CreateProfileModal from "../settings/profiles/CreateProfileModal"
import type { Account } from "@/graphql/codegen/graphql"

interface Props {
  account: Account | null
}

export default function Profile({ account }: Props) {
  const [modalVisible, setModalVisible] = useState(
    () => !account?.defaultProfile
  )

  const router = useRouter()

  const closeModal = useCallback(() => {
    setModalVisible(false)
    router.back()
  }, [router])

  return (
    <>
      <h6 className="text-lg">No profile found.</h6>
      <p className="text-textLight">
        Create a profile to start upload, follow, comment, and more on VewWit.
      </p>

      {modalVisible && <CreateProfileModal closeModal={closeModal} />}
    </>
  )
}
