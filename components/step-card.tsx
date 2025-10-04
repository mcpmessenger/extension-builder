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
    <Card className="p-6 bg-white/10 backdrop-blur-sm border-white/20">
      <div className="flex items-start gap-4">
        {/* Thumbnail Preview */}
        {step.screenshot && (
          <div className="flex-shrink-0">
            <div className="relative h-20 w-32 overflow-hidden rounded-lg border border-white/20">
              <img 
                src={step.screenshot} 
                alt="Step screenshot" 
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                <ImageIcon className="h-4 w-4 text-white" />
              </div>
            </div>
          </div>
        )}
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-semibold text-white truncate">{step.title}</h3>
            <Badge variant="outline" className="bg-white/20 text-white border-white/30 text-xs">{step.position}</Badge>
            {step.screenshot && (
              <Badge variant="secondary" className="gap-1 bg-green-500/20 text-green-300 border-green-400/30 text-xs">
                <ImageIcon className="h-3 w-3" />
                Screenshot
              </Badge>
            )}
          </div>
          
          <p className="text-sm text-gray-300 mb-3 line-clamp-2">{step.description}</p>
          
          <div className="flex items-center gap-2 flex-wrap">
            <code className="rounded bg-white/10 border border-white/20 px-2 py-1 text-xs font-mono text-gray-300 max-w-full truncate">
              {step.selector.length > 50 ? `${step.selector.substring(0, 50)}...` : step.selector}
            </code>
            {step.annotations.length > 0 && (
              <span className="text-xs text-blue-300 bg-blue-500/20 px-2 py-1 rounded">
                {step.annotations.length} annotation{step.annotations.length !== 1 ? "s" : ""}
              </span>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-1 flex-shrink-0">
          <Button variant="ghost" size="icon" onClick={onEdit} className="text-white hover:bg-white/10">
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={onDuplicate} className="text-white hover:bg-white/10">
            <Copy className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={onDelete} className="text-red-400 hover:bg-red-500/20">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  )
}
