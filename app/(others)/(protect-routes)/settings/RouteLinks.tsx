"use client"

import React from "react"

import ActiveLink from "@/components/nav/ActiveLink"

export default function RouteLinks() {
  return (
    <>
      <ActiveLink name="General" href="/settings" isSubLink />
      <ActiveLink name="Wallet" href="/settings/wallet" isSubLink />
      <ActiveLink name="Preferences" href="/settings/preferences" isSubLink />
      <ActiveLink name="Profiles" href="/settings/profiles" isSubLink />
    </>
  )
}
