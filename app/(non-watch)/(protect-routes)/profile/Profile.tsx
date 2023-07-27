"use client"

import React, { useCallback } from "react"
import { useRouter } from "next/navigation"

import CreateProfileModal from "../settings/profiles/CreateProfileModal"
import type { Account } from "@/graphql/codegen/graphql"

interface Props {
  account: Account | null
}

export default function Profile({ account }: Props) {
  const router = useRouter()

  const closeModal = useCallback(() => {
    router.replace("/")
  }, [router])

  return (
    <>
      <h6 className="text-lg">No profile found.</h6>
      <p className="text-textLight">
        Create a profile to start upload, like, comment, and more on VewWit.
      </p>

      {!account?.defaultProfile && (
        <CreateProfileModal
          closeModal={closeModal}
          title="Create Profile"
          additionalInfo="One more step, create a profile to start upload, like, comment, and more on VewWit."
          useDoItLaterClose={true}
          doItLaterText="I will do it later"
        />
      )}
    </>
  )
}
