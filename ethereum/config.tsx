import { EthereumClient, w3mConnectors, w3mProvider } from "@web3modal/ethereum"
import { configureChains, createConfig } from "wagmi"
import { mainnet, sepolia, localhost } from "@wagmi/chains"

import { WALLET_CONNECT_PROJECT_ID } from "@/lib/constants"

const chains = [mainnet, sepolia, localhost]
const projectId = WALLET_CONNECT_PROJECT_ID

const { publicClient } = configureChains(chains, [w3mProvider({ projectId })])
export const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: w3mConnectors({ projectId, chains }),
  publicClient,
})
export const ethereumClient = new EthereumClient(wagmiConfig, chains)
