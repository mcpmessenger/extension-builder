"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X, ChevronLeft, ChevronRight } from "lucide-react"

interface Step {
  id: string
  title: string
  description: string
  selector: string
  position: "top" | "bottom" | "left" | "right"
  screenshot?: string
  annotations: any[]
}

interface WorkflowPreviewProps {
  steps: Step[]
  onClose: () => void
}

export function WorkflowPreview({ steps, onClose }: WorkflowPreviewProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 })

  useEffect(() => {
    // Simulate tooltip positioning in the center of the preview
    const previewArea = document.querySelector(".preview-area")
    if (previewArea) {
      const rect = previewArea.getBoundingClientRect()
      setTooltipPosition({
        top: rect.height / 2 - 150,
        left: rect.width / 2 - 200,
      })
    }
  }, [currentStep])

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      onClose()
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  if (steps.length === 0) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <Card className="p-8 text-center bg-white/10 backdrop-blur-sm border-white/20">
          <h3 className="text-lg font-semibold text-white">No Steps to Preview</h3>
          <p className="mt-2 text-sm text-gray-300">Add steps to your workflow to see the preview</p>
          <Button onClick={onClose} className="mt-6 bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20">
            Close Preview
          </Button>
        </Card>
      </div>
    )
  }

  const step = steps[currentStep]

  return (
    <div className="fixed inset-0 z-50">
      {/* Preview Header */}
      <div className="border-b border-border/20 bg-card/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30">Preview Mode</Badge>
            <span className="text-sm text-gray-300">
              Step {currentStep + 1} of {steps.length}
            </span>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:bg-white/10">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Preview Area */}
      <div className="preview-area relative h-[calc(100vh-73px)] overflow-hidden">
        {/* Simulated Page Background */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="mx-auto h-64 w-96 rounded-lg border-2 border-dashed border-white/30 bg-white/10 backdrop-blur-sm p-8">
              <div className="mb-4 h-8 w-32 rounded bg-white/20" />
              <div className="mb-2 h-4 w-full rounded bg-white/20" />
              <div className="mb-2 h-4 w-full rounded bg-white/20" />
              <div className="h-4 w-2/3 rounded bg-white/20" />
            </div>
            <p className="mt-4 text-sm text-gray-300">Simulated target page</p>
          </div>
        </div>

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/30" />

        {/* Highlight Box */}
        <div
          className="absolute rounded-lg border-2 border-white shadow-lg"
          style={{
            top: tooltipPosition.top + 100,
            left: tooltipPosition.left + 150,
            width: 200,
            height: 100,
          }}
        />

        {/* Tooltip */}
        <Card
          className="absolute w-[400px] p-6 shadow-2xl bg-white/10 backdrop-blur-sm border-white/20"
          style={{
            top: tooltipPosition.top,
            left: tooltipPosition.left,
          }}
        >
          <div className="mb-4 flex items-center justify-between">
            <Badge variant="outline" className="bg-white/20 text-white border-white/30">
              Step {currentStep + 1} of {steps.length}
            </Badge>
            <Button variant="ghost" size="icon" className="h-6 w-6 text-white hover:bg-white/10" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          <h3 className="mb-2 text-lg font-semibold text-white">{step.title}</h3>
          <p className="mb-4 text-sm text-gray-300">{step.description}</p>

          {step.screenshot && (
            <div className="mb-4 overflow-hidden rounded-lg border border-white/20">
              <img src={step.screenshot || "/placeholder.svg"} alt="Step screenshot" className="w-full" />
            </div>
          )}

          <div className="mb-4 rounded-lg bg-white/10 border border-white/20 p-3">
            <p className="text-xs text-gray-300">Target element:</p>
            <code className="text-xs font-mono text-white">{step.selector}</code>
          </div>

          <div className="flex items-center justify-between gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="gap-2 bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <Button onClick={handleNext} size="sm" className="gap-2 bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20">
              {currentStep === steps.length - 1 ? "Finish" : "Next"}
              {currentStep < steps.length - 1 && <ChevronRight className="h-4 w-4" />}
            </Button>
          </div>
        </Card>

        {/* Position Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <Card className="px-4 py-2 bg-white/10 backdrop-blur-sm border-white/20">
            <p className="text-xs text-gray-300">
              Tooltip position: <span className="font-semibold text-white">{step.position}</span>
            </p>
          </Card>
        </div>
      </div>
    </div>
  )
}
