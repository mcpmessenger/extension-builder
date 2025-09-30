"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Camera, Upload, X, Download } from "lucide-react"
import { AnnotationCanvas } from "@/components/annotation-canvas"

interface ScreenshotCaptureProps {
  onSave: (screenshot: string, annotations: any[]) => void
  initialScreenshot?: string
  initialAnnotations?: any[]
}

export function ScreenshotCapture({ onSave, initialScreenshot, initialAnnotations = [] }: ScreenshotCaptureProps) {
  const [screenshot, setScreenshot] = useState<string | null>(initialScreenshot || null)
  const [annotations, setAnnotations] = useState<any[]>(initialAnnotations)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleCapture = async () => {
    try {
      // In a real implementation, this would use Chrome's capture API
      // For demo purposes, we'll simulate with a placeholder
      const canvas = document.createElement("canvas")
      canvas.width = 1200
      canvas.height = 800
      const ctx = canvas.getContext("2d")
      if (ctx) {
        // Create a gradient background as demo
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
        gradient.addColorStop(0, "#1a1a1a")
        gradient.addColorStop(1, "#2d2d2d")
        ctx.fillStyle = gradient
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        // Add some demo UI elements
        ctx.fillStyle = "#3a3a3a"
        ctx.fillRect(50, 50, 300, 60)
        ctx.fillRect(50, 150, 1100, 600)

        const dataUrl = canvas.toDataURL("image/png")
        setScreenshot(dataUrl)
      }
    } catch (error) {
      console.error("[v0] Screenshot capture failed:", error)
    }
  }

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setScreenshot(event.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleClear = () => {
    setScreenshot(null)
    setAnnotations([])
  }

  const handleSave = () => {
    if (screenshot) {
      onSave(screenshot, annotations)
    }
  }

  if (!screenshot) {
    return (
      <Card className="p-12">
        <div className="flex flex-col items-center justify-center text-center">
          <Camera className="h-16 w-16 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold text-foreground">Capture or Upload Screenshot</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Take a screenshot of your target page or upload an existing image
          </p>
          <div className="mt-6 flex gap-3">
            <Button onClick={handleCapture} className="gap-2">
              <Camera className="h-4 w-4" />
              Capture Screen
            </Button>
            <Button variant="outline" className="gap-2 bg-transparent" onClick={() => fileInputRef.current?.click()}>
              <Upload className="h-4 w-4" />
              Upload Image
            </Button>
          </div>
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} />
        </div>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">Screenshot & Annotations</h3>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleClear} className="gap-2 bg-transparent">
            <X className="h-4 w-4" />
            Clear
          </Button>
          <Button size="sm" onClick={handleSave} className="gap-2">
            <Download className="h-4 w-4" />
            Save
          </Button>
        </div>
      </div>

      <AnnotationCanvas screenshot={screenshot} annotations={annotations} onAnnotationsChange={setAnnotations} />
    </div>
  )
}
