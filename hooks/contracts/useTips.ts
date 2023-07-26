import { usePrepareContractWrite, useContractEvent } from "wagmi"

import TipsContractDev from "../../abi/localhost/Tips.json"
import TipsContractTest from "../../abi/testnet/Tips.json"

const env = process.env.NEXT_PUBLIC_ENV as "localhost" | "test"
const contract = env === "localhost" ? TipsContractDev : TipsContractTest

export function usePrepareStationContractWrite(
  to: string,
  name: string,
  nameValid: boolean
) {
  const { config } = usePrepareContractWrite({
    address: contract.address as any,
    abi: [
      {
        type: "function",
        name: "mint",
        constant: false,
        payable: false,
        inputs: [
          { type: "address", name: "to" },
          { type: "string", name: "name" },
        ],
        outputs: [],
      },
    ],
    functionName: "mint",
    args: [to, name.toLowerCase()],
    enabled: nameValid,
  })

  return {
    config,
  }
}

export function useStationMintedEvent(name: string, cb: () => void) {
  useContractEvent({
    address: contract.address as any,
    abi: [
      {
        type: "event",
        anonymous: false,
        name: "StationMinted",
        inputs: [
          { type: "uint256", name: "tokenId", indexed: true },
          { type: "address", name: "owner", indexed: true },
          { type: "uint256", name: "timestamp", indexed: false },
        ],
      },
    ],
    eventName: "StationMinted",
    listener: async (tokenId) => {
      try {
        const id = tokenId.toNumber()
        // Create a station in the database
        const result = await fetch(`/station/create`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, tokenId: id }),
        })

        await result.json()
        // Call the callback fn
        cb()
      } catch (error) {
        console.error("error: ", error)
      }
    },
    once: true,
  })
}
