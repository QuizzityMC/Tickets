"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Keyboard } from "lucide-react"

const keyboardLayout = [
  ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"],
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L", "@"],
  ["Z", "X", "C", "V", "B", "N", "M", ",", "."],
  ["Space", "Backspace"],
]

export function OnScreenKeyboard() {
  const [isVisible, setIsVisible] = useState(false)

  const handleKeyPress = (key: string) => {
    const activeElement = document.activeElement as HTMLInputElement
    if (activeElement && activeElement.tagName === "INPUT") {
      if (key === "Space") {
        activeElement.value += " "
      } else if (key === "Backspace") {
        activeElement.value = activeElement.value.slice(0, -1)
      } else {
        activeElement.value += key
      }
      activeElement.dispatchEvent(new Event("input", { bubbles: true }))
    }
  }

  return (
    <>
      <Button className="fixed bottom-4 right-4 z-50" onClick={() => setIsVisible(!isVisible)} size="icon">
        <Keyboard className="h-4 w-4" />
      </Button>
      {isVisible && (
        <div className="fixed bottom-0 left-0 right-0 bg-gray-200 p-2 z-40">
          {keyboardLayout.map((row, rowIndex) => (
            <div key={rowIndex} className="flex justify-center mb-1">
              {row.map((key) => (
                <Button key={key} className="m-1" onClick={() => handleKeyPress(key)}>
                  {key}
                </Button>
              ))}
            </div>
          ))}
        </div>
      )}
    </>
  )
}
