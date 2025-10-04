"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, GripVertical } from "lucide-react"
import { StepCard } from "@/components/step-card"
import { StepDialog } from "@/components/step-dialog"
import { FlowImportDialog } from "@/components/flow-import-dialog"
import { WorkflowSuggestions } from "@/components/workflow-suggestions"
import { WorkflowSuggestion } from "@/lib/flow-analysis-service"

interface Step {
  id: string
  title: string
  description: string
  selector: string
  position: "top" | "bottom" | "left" | "right"
  screenshot?: string
  annotations: Annotation[]
}

interface Annotation {
  id: string
  type: "arrow" | "box" | "text" | "highlight"
  x: number
  y: number
  width?: number
  height?: number
  text?: string
  color: string
}

export function WorkflowEditor({ workflowId }: { workflowId: string }) {
  const [steps, setSteps] = useState<Step[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingStep, setEditingStep] = useState<Step | null>(null)
  const [workflowSuggestions, setWorkflowSuggestions] = useState<WorkflowSuggestion[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)

  // Load steps from localStorage on component mount
  useEffect(() => {
    const savedSteps = localStorage.getItem(`workflow-${workflowId}-steps`)
    if (savedSteps) {
      try {
        setSteps(JSON.parse(savedSteps))
      } catch (error) {
        console.error('Failed to parse saved steps:', error)
      }
    }
  }, [workflowId])

  const handleAddStep = () => {
    setEditingStep(null)
    setIsDialogOpen(true)
  }

  const handleEditStep = (step: Step) => {
    setEditingStep(step)
    setIsDialogOpen(true)
  }

  const handleSaveStep = (step: Step) => {
    if (editingStep) {
      const updatedSteps = steps.map((s) => (s.id === step.id ? step : s))
      setSteps(updatedSteps)
      // Save to localStorage for persistence
      localStorage.setItem(`workflow-${workflowId}-steps`, JSON.stringify(updatedSteps))
    } else {
      const newStep = { ...step, id: Date.now().toString() }
      const updatedSteps = [...steps, newStep]
      setSteps(updatedSteps)
      // Save to localStorage for persistence
      localStorage.setItem(`workflow-${workflowId}-steps`, JSON.stringify(updatedSteps))
    }
    setIsDialogOpen(false)
  }

  const handleDeleteStep = (id: string) => {
    const updatedSteps = steps.filter((s) => s.id !== id)
    setSteps(updatedSteps)
    localStorage.setItem(`workflow-${workflowId}-steps`, JSON.stringify(updatedSteps))
  }

  const handleDuplicateStep = (step: Step) => {
    const newStep = { ...step, id: Date.now().toString(), title: `${step.title} (Copy)` }
    const updatedSteps = [...steps, newStep]
    setSteps(updatedSteps)
    localStorage.setItem(`workflow-${workflowId}-steps`, JSON.stringify(updatedSteps))
  }

  const handleFlowImported = (suggestions: WorkflowSuggestion[]) => {
    setWorkflowSuggestions(suggestions)
    setShowSuggestions(true)
  }

  const handleApplySuggestion = (suggestion: WorkflowSuggestion) => {
    // Convert AI suggestion steps to regular steps
    const newSteps = suggestion.steps.map((aiStep, index) => ({
      id: Date.now().toString() + index,
      title: aiStep.title,
      description: aiStep.description,
      selector: aiStep.selector,
      position: aiStep.tooltip.position as "top" | "bottom" | "left" | "right",
      screenshot: undefined,
      annotations: []
    }))
    
    const updatedSteps = [...steps, ...newSteps]
    setSteps(updatedSteps)
    localStorage.setItem(`workflow-${workflowId}-steps`, JSON.stringify(updatedSteps))
    setShowSuggestions(false)
  }

  const handleCustomizeSuggestion = (suggestion: WorkflowSuggestion) => {
    console.log('Customizing suggestion:', suggestion)
    // TODO: Open customization dialog
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white">Workflow Steps</h2>
          <p className="text-sm text-gray-300">Add and configure steps for your guided workflow</p>
        </div>
        <div className="flex gap-2">
          <FlowImportDialog onFlowImported={handleFlowImported} />
          <Button onClick={handleAddStep} className="gap-2 bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20">
            <Plus className="h-4 w-4" />
            Add Step
          </Button>
        </div>
      </div>

      {showSuggestions && (
        <div className="mb-6">
          <WorkflowSuggestions
            suggestions={workflowSuggestions}
            onApplySuggestion={handleApplySuggestion}
            onCustomizeSuggestion={handleCustomizeSuggestion}
          />
        </div>
      )}

      {steps.length === 0 ? (
        <Card className="p-12 text-center bg-white/10 backdrop-blur-sm border-white/20">
          <h3 className="text-lg font-semibold text-white">No steps yet</h3>
          <p className="mt-2 text-sm text-gray-300">Add your first step to start building the workflow</p>
          <Button onClick={handleAddStep} className="mt-6 bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20">
            Add First Step
          </Button>
        </Card>
      ) : (
        <div className="space-y-3">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-start gap-3">
              <div className="flex flex-col items-center gap-2 pt-6">
                <Button variant="ghost" size="icon" className="h-6 w-6 cursor-grab text-white hover:bg-white/10">
                  <GripVertical className="h-4 w-4" />
                </Button>
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-sm font-semibold text-white border border-white/30">
                  {index + 1}
                </div>
              </div>
              <div className="flex-1">
                <StepCard
                  step={step}
                  onEdit={() => handleEditStep(step)}
                  onDelete={() => handleDeleteStep(step.id)}
                  onDuplicate={() => handleDuplicateStep(step)}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      <StepDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} step={editingStep} onSave={handleSaveStep} />
    </div>
  )
}
