import React, { Suspense } from "react"

import SectionHeader from "../SectionHeader"
import ManageProfiles from "./ManageProfiles"
import ManageProfilesTemplate from "./ManageProfilesTemplate"
import { getAccount } from "@/lib/server"

export default async function Profiles() {
  const data = await getAccount()
  const account = data?.account

  return (
    <>
      <SectionHeader sectionName="Profiles" />

      <div className="mt-4">
        <Suspense fallback={<ManageProfilesTemplate />}>
          <ManageProfiles
            account={account!}
            defaultProfileId={account?.defaultProfile?.id || ""}
          />
        </Suspense>
      </div>
    </>
  )
}
