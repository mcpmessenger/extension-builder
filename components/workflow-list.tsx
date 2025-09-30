"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MoreVertical, Edit, Trash2, Download, Eye } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Link from "next/link"

interface Workflow {
  id: string
  name: string
  description: string
  steps: number
  status: "draft" | "published"
  createdAt: string
  updatedAt: string
}

export function WorkflowList() {
  const [workflows, setWorkflows] = useState<Workflow[]>([
    {
      id: "1",
      name: "User Onboarding Flow",
      description: "Guide new users through account setup and first actions",
      steps: 5,
      status: "published",
      createdAt: "2025-01-15",
      updatedAt: "2025-01-20",
    },
    {
      id: "2",
      name: "Feature Discovery Tour",
      description: "Showcase key features with interactive annotations",
      steps: 8,
      status: "draft",
      createdAt: "2025-01-18",
      updatedAt: "2025-01-22",
    },
  ])

  const handleDelete = (id: string) => {
    setWorkflows(workflows.filter((w) => w.id !== id))
  }

  if (workflows.length === 0) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-dashed border-border bg-card p-12 text-center">
        <h3 className="text-lg font-semibold text-foreground">No workflows yet</h3>
        <p className="mt-2 text-sm text-muted-foreground">Get started by creating your first workflow</p>
        <Link href="/workflows/new">
          <Button className="mt-6">Create Workflow</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">Your Workflows</h2>
        <p className="text-sm text-muted-foreground">{workflows.length} total</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {workflows.map((workflow) => (
          <Card key={workflow.id} className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-foreground">{workflow.name}</h3>
                  <Badge variant={workflow.status === "published" ? "default" : "secondary"}>{workflow.status}</Badge>
                </div>
                <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{workflow.description}</p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href={`/workflows/${workflow.id}`} className="flex items-center gap-2">
                      <Edit className="h-4 w-4" />
                      Edit
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex items-center gap-2">
                    <Eye className="h-4 w-4" />
                    Preview
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    Export
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="flex items-center gap-2 text-destructive"
                    onClick={() => handleDelete(workflow.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
              <span>{workflow.steps} steps</span>
              <span>•</span>
              <span>Updated {new Date(workflow.updatedAt).toLocaleDateString()}</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
