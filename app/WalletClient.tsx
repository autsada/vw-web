"use client"

import React from "react"
import { WagmiConfig } from "wagmi"
import { Web3Modal } from "@web3modal/react"

import { wagmiConfig, ethereumClient } from "@/ethereum/config"
import { WALLET_CONNECT_PROJECT_ID } from "@/lib/constants"

export default function WalletClient({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <WagmiConfig config={wagmiConfig}>{children}</WagmiConfig>

      <Web3Modal
        projectId={WALLET_CONNECT_PROJECT_ID}
        ethereumClient={ethereumClient}
      />
    </>
  )
}
