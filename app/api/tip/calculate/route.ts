import { NextResponse } from "next/server"
import { calculateTips } from "@/graphql"

export async function POST(req: Request) {
  try {
    const { tip } = (await req.json()) as {
      tip: number
    }

    if (!tip)
      return new NextResponse("Name is required.", {
        status: 500,
      })

    const result = await calculateTips(tip)

    return NextResponse.json(result)
  } catch (error) {
    throw error
  }
}
