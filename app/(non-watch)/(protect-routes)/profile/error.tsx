"use client" // Error components must be Client Components

import { useRouter } from "next/navigation"

export default function Error({
  error,
  reset,
}: {
  error: Error
  reset: () => void
}) {
  const router = useRouter()

  return (
    <div className="text-center py-10">
      <h4 className="error font-semibold text-4xl">Something not right!</h4>
      <p className="mt-4 mb-8">
        Please try refreshing the page or click below to go to homepage.
      </p>
      <button
        className="btn-dark px-8 rounded-full"
        onClick={
          // Attempt to recover by trying to re-render the segment
          () => router.replace("/")
        }
      >
        Home
      </button>
    </div>
  )
}
