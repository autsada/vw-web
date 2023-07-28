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
    <div className="h-screen flex flex-col justify-center items-center">
      <h4 className="error font-semibold text-4xl">Something not right!</h4>
      <p className="mt-4 mb-8">
        The profile you are trying to reach might not exist. Please try
        refreshing the page or click below to go to homepage.
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
