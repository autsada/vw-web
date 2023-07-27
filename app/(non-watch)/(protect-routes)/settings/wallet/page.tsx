import React from "react"

import Address from "./Address"
import SectionHeader from "../SectionHeader"
import { getAccount } from "@/lib/server"
import { getBalance } from "@/graphql"

export default async function Wallet() {
  const data = await getAccount()
  const account = data?.account
  const balance = await getBalance(account?.owner || "")

  return (
    <>
      <SectionHeader sectionName="Wallet" />

      <div className="mt-4">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-y-5 lg:gap-y-0">
          <div className="col-span-1 lg:col-span-3">
            <h6 className="text-base">Your wallet</h6>
            <div>
              <Address address={account?.owner || ""} balance={balance || ""} />
              <div className="px-4 py-2 font-semibold text-base">
                {Number(balance).toFixed(4)} ETH
              </div>
            </div>
          </div>
          <div className="lg:col-span-2">
            <button className="btn-dark mx-0 lg:mx-auto px-8 rounded-full">
              Transfer money
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
