"use client"

import React from "react"

import StreamModal from "./StreamModal"
import type { Profile } from "@/graphql/codegen/graphql"

interface Props {
  profile: Profile
}

export default function CreateStream({ profile }: Props) {
  return <StreamModal profileName={profile.name} />
}
