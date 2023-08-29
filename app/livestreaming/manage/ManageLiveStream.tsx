"use client"

import React from "react"

import type { Maybe, FetchPublishesResponse } from "@/graphql/codegen/graphql"

interface Props {
  fetchResult: Maybe<FetchPublishesResponse> | undefined
}

export default function ManageLiveStream({ fetchResult }: Props) {
  return <div>ManageLiveStream</div>
}
