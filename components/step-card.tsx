"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2, Copy, ImageIcon } from "lucide-react"

interface Step {
  id: string
  title: string
  description: string
  selector: string
  position: "top" | "bottom" | "left" | "right"
  screenshot?: string
  annotations: any[]
}

interface StepCardProps {
  step: Step
  onEdit: () => void
  onDelete: () => void
  onDuplicate: () => void
}

export function StepCard({ step, onEdit, onDelete, onDuplicate }: StepCardProps) {
  return (
    <Card className="p-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-foreground">{step.title}</h3>
            <Badge variant="outline">{step.position}</Badge>
            {step.screenshot && (
              <Badge variant="secondary" className="gap-1">
                <ImageIcon className="h-3 w-3" />
                Screenshot
              </Badge>
            )}
          </div>
          <p className="mt-2 text-sm text-muted-foreground">{step.description}</p>
          <div className="mt-3 flex items-center gap-2">
            <code className="rounded bg-muted px-2 py-1 text-xs font-mono text-muted-foreground">{step.selector}</code>
            {step.annotations.length > 0 && (
              <span className="text-xs text-muted-foreground">
                {step.annotations.length} annotation{step.annotations.length !== 1 ? "s" : ""}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" onClick={onEdit}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={onDuplicate}>
            <Copy className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={onDelete}>
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      </div>
    </Card>
  )
}
