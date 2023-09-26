import { useRouter, usePathname } from "next/navigation"

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error
  reset: () => void
}) {
  const router = useRouter()
  const pathname = usePathname()

  return (
    <div className="h-screen flex flex-col justify-center items-center">
      <h4 className="error font-semibold text-4xl">Something not right!</h4>
      <p className="mt-4 mb-8">
        Please try refreshing the page
        {pathname !== "/" ? " or click below to go to homepage" : ""}.
      </p>
      {pathname !== "/" && (
        <button
          className="btn-dark px-8 rounded-full"
          onClick={
            // Attempt to recover by trying to re-render the segment
            () => router.replace("/")
          }
        >
          Home
        </button>
      )}
    </div>
  )
}
