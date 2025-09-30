import { WorkflowForm } from "@/components/workflow-form"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function NewWorkflowPage() {
  return (
    <div className="min-h-screen">
      <header className="border-b border-border/20 bg-card/80 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-6 py-4">
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
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-8">
        <WorkflowForm />
      </main>
    </div>
  )
}
