import React, { useEffect, useState } from "react"

interface Props {
  initialTime: number
  setIsTimerDone: React.Dispatch<React.SetStateAction<boolean>>
}

export default function Counter({ initialTime, setIsTimerDone }: Props) {
  const [timer, setTimer] = useState(initialTime)

  useEffect(() => {
    if (initialTime > 0) {
      const id = setInterval(() => {
        setTimer((prev) => {
          if (prev > 0) {
            return prev - 1
          } else {
            setIsTimerDone(true)
            clearInterval(id)
            return prev
          }
        })
      }, 1000)
    }
  }, [initialTime, setIsTimerDone])

  return <>{timer}</>
}
