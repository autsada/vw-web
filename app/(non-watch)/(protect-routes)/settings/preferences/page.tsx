import React from "react"
import { redirect } from "next/navigation"

import SectionHeader from "../SectionHeader"
import WatchPreferences from "./WatchPreferences"
import ReadPreferences from "./ReadPreferences"
import { getAccount } from "@/lib/server"

export default async function Preferences() {
  const data = await getAccount()
  const account = data?.account
  const loggedInProfile = account?.defaultProfile
  if (!loggedInProfile) {
    redirect("/settings/profiles")
  }

  return (
    <div className="pb-10 md:pb-20">
      <SectionHeader sectionName="Preferences" />

      <div className="mt-4">
        <h6 className="text-base">Watch preferences</h6>
        <p>
          Decide what you want to see on VewWit based on your preferences. You
          can choose upto 10 topics.
        </p>
        <div className="mt-5 px-0 pb-10 sm:px-10 sm:pb-0">
          <WatchPreferences preferences={loggedInProfile.watchPreferences} />
        </div>
      </div>

      <div className="mt-8">
        <h6 className="text-base">Read preferences</h6>
        <p>
          Decide what you want to read on VewWit based on your preferences. You
          can choose upto 10 topics.
        </p>
        <div className="mt-5 px-0 pb-10 sm:px-10 sm:pb-0">
          <ReadPreferences preferences={loggedInProfile.readPreferences} />
        </div>
      </div>
    </div>
  )
}
