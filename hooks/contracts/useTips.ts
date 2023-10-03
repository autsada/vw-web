import { usePrepareContractWrite } from "wagmi"
import { ethers } from "ethers"

import TipsContractDev from "../../abi/localhost/Tips.json"
import TipsContractTest from "../../abi/testnet/Tips.json"
import TipsContractProd from "../../abi/mainnet/Tips.json"

const env = process.env.NEXT_PUBLIC_ENV as "localhost" | "test" | "prod"
const contract =
  env === "prod"
    ? TipsContractProd
    : env === "test"
    ? TipsContractTest
    : TipsContractDev

/**
 * @param to an address of the receiver
 * @param tipInUSD a quantity (how much in USD) of the tips to be sent
 * @param tipInETH ETH equivalent of the tips
 * @returns
 */
export function usePrepareSendTips(input: {
  tipId: string
  to: string
  tipInUSD: number
  tipInETH: string
}) {
  return usePrepareContractWrite({
    address: contract.address as any,
    value: ethers.parseEther(input.tipInETH),
    abi: [
      {
        type: "function",
        name: "tip",
        constant: false,
        stateMutability: "payable",
        payable: true,
        inputs: [
          { type: "string", name: "tipId" },
          { type: "address", name: "to" },
          { type: "uint256", name: "qty" },
        ],
        outputs: [],
      },
    ],
    functionName: "tip",
    args: [input.tipId, input.to, input.tipInUSD],
    enabled: !!input.to && !!input.tipInUSD && !!input.tipInETH,
  })
}
