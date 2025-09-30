"use client"

import { useState } from "react"
import { WorkflowEditor } from "@/components/workflow-editor"
import { ExtensionGeneratorDialog } from "@/components/extension-generator-dialog"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Eye, Download } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function WorkflowEditorPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [showGenerator, setShowGenerator] = useState(false)

  // Mock workflow data - in real app, fetch from database
  const workflow = {
    id: params.id,
    name: "User Onboarding Flow",
    description: "Guide new users through account setup and first actions",
    targetUrl: "https://example.com",
    steps: [],
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-semibold text-foreground">User Onboarding Flow</h1>
                <p className="text-sm text-muted-foreground">Edit workflow steps and settings</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                className="gap-2 bg-transparent"
                onClick={() => router.push(`/workflows/${params.id}/preview`)}
              >
                <Eye className="h-4 w-4" />
                Preview
              </Button>
              <Button className="gap-2" onClick={() => setShowGenerator(true)}>
                <Download className="h-4 w-4" />
                Generate Extension
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">
        <WorkflowEditor workflowId={params.id} />
      </main>

      <ExtensionGeneratorDialog open={showGenerator} onOpenChange={setShowGenerator} workflow={workflow} />
    </div>
  )
}
