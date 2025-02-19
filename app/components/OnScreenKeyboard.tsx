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
    if (activeElement && (activeElement.tagName === "INPUT" || activeElement.tagName === "TEXTAREA")) {
      const start = activeElement.selectionStart || 0
      const end = activeElement.selectionEnd || 0
      const value = activeElement.value

      let newValue: string
      let newPosition: number

      if (key === "Space") {
        newValue = value.slice(0, start) + " " + value.slice(end)
        newPosition = start + 1
      } else if (key === "Backspace") {
        if (start === end && start > 0) {
          // If no text is selected, delete the character before the cursor
          newValue = value.slice(0, start - 1) + value.slice(end)
          newPosition = start - 1
        } else {
          // If text is selected, delete the selected text
          newValue = value.slice(0, start) + value.slice(end)
          newPosition = start
        }
      } else {
        newValue = value.slice(0, start) + key + value.slice(end)
        newPosition = start + 1
      }

      // Update the input value
      activeElement.value = newValue

      // Update cursor position
      activeElement.setSelectionRange(newPosition, newPosition)

      // Create and dispatch input event
      const inputEvent = new Event("input", { bubbles: true, cancelable: true })
      activeElement.dispatchEvent(inputEvent)

      // Create and dispatch change event
      const changeEvent = new Event("change", { bubbles: true, cancelable: true })
      activeElement.dispatchEvent(changeEvent)

      // Force React to update the input value by triggering a keydown event
      const keydownEvent = new KeyboardEvent("keydown", {
        key: key,
        bubbles: true,
        cancelable: true,
      })
      activeElement.dispatchEvent(keydownEvent)
    }
  }

  return (
    <>
      <Button
        className="fixed bottom-4 right-4 z-50"
        onClick={() => setIsVisible(!isVisible)}
        size="icon"
        variant="outline"
      >
        <Keyboard className="h-4 w-4" />
      </Button>
      {isVisible && (
        <div className="fixed bottom-0 left-0 right-0 bg-background border-t p-2 z-40 shadow-lg">
          {keyboardLayout.map((row, rowIndex) => (
            <div key={rowIndex} className="flex justify-center gap-1 mb-1">
              {row.map((key) => (
                <Button
                  key={key}
                  variant={key === "Space" || key === "Backspace" ? "secondary" : "outline"}
                  className={`${
                    key === "Space" ? "px-8" : key === "Backspace" ? "px-4" : "w-10"
                  } h-10 text-sm font-medium`}
                  onClick={() => handleKeyPress(key)}
                >
                  {key === "Backspace" ? "←" : key === "Space" ? "Space" : key}
                </Button>
              ))}
            </div>
          ))}
        </div>
      )}
    </>
  )
}

