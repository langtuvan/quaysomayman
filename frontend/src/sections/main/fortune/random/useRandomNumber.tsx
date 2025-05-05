// src/components/AutoRandomNumber.js
import React, { useState, useEffect } from 'react'

export const useRandomNumber = (
  fixedNumber: number | null = null,
  timeOut = 4000,
) => {
  const [randomNumber, setRandomNumber] = useState<any>(0)
  const [isRunning, setIsRunning] = useState<boolean>(false)

  useEffect(() => {
    // if (fixedNumber === 0) return
    let interval: any

    if (isRunning) {
      interval = setInterval(() => {
        const newNumber = Math.floor(Math.random() * 10) // Số ngẫu nhiên từ 0 đến 9
        setRandomNumber(newNumber)
      }, 50) // Cập nhật số ngẫu nhiên mỗi 100ms
    }

    // Dừng sau 4 giây và gán số đã biết
    const timeout = setTimeout(() => {
      setIsRunning(false)
      clearInterval(interval) // Dừng interval
      setRandomNumber(fixedNumber)
    }, timeOut) // 4 giây

    // Cleanup
    return () => {
      clearInterval(interval)
      clearTimeout(timeout)
    }
  }, [isRunning, fixedNumber])

  return {
    randomNumber,
    setIsRunning,
  }
}
