import { WorkflowList } from "@/components/workflow-list"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  return (
    <div className="min-h-screen">
      <header className="border-b border-border/20 bg-card/80 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-white">Extension Builder</h1>
              <p className="text-sm text-gray-300">Create guided workflow extensions</p>
            </div>
            <Link href="/workflows/new">
              <Button className="gap-2 bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20">
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
