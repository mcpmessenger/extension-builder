import { WorkflowList } from "@/components/workflow-list"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-foreground">Extension Builder</h1>
              <p className="text-sm text-muted-foreground">Create guided workflow extensions</p>
            </div>
            <Link href="/workflows/new">
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                New Workflow
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">
        <WorkflowList />
      </main>
    </div>
  )
}
