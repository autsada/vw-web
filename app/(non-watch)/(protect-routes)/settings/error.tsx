"use client" // Error components must be Client Components

import ErrorPage from "@/components/Error"

export default function Error({
  error,
  reset,
}: {
  error: Error
  reset: () => void
}) {
  return <ErrorPage error={error} reset={reset} />
}
