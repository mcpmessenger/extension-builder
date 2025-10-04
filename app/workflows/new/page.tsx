"use client";

import { WorkflowForm } from "@/components/workflow-form"
import { FlowImportDialog } from "@/components/flow-import-dialog"
import { WorkflowSuggestions } from "@/components/workflow-suggestions"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { WorkflowSuggestion } from "@/lib/flow-analysis-service"

export default function NewWorkflowPage() {
  const [workflowSuggestions, setWorkflowSuggestions] = useState<WorkflowSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleFlowImported = (suggestions: WorkflowSuggestion[]) => {
    setWorkflowSuggestions(suggestions);
    setShowSuggestions(true);
  };

  const handleApplySuggestion = (suggestion: WorkflowSuggestion) => {
    // Apply the suggestion to the current workflow
    console.log('Applying suggestion:', suggestion);
    // Implementation to add steps to workflow
  };

  const handleCustomizeSuggestion = (suggestion: WorkflowSuggestion) => {
    // Open customization dialog
    console.log('Customizing suggestion:', suggestion);
  };

  return (
    <div className="min-h-screen">
      <header className="border-b border-white/10 bg-transparent backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-semibold text-white">Create New Workflow</h1>
                <p className="text-sm text-gray-300">Set up your workflow details and add steps</p>
              </div>
            </div>
            <FlowImportDialog onFlowImported={handleFlowImported} />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-8">
        {showSuggestions && (
          <div className="mb-8">
            <WorkflowSuggestions
              suggestions={workflowSuggestions}
              onApplySuggestion={handleApplySuggestion}
              onCustomizeSuggestion={handleCustomizeSuggestion}
            />
          </div>
        )}

        <WorkflowForm />
      </main>
    </div>
  )
}
