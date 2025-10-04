"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScreenshotCapture } from "@/components/screenshot-capture"

interface Step {
  id: string
  title: string
  description: string
  selector: string
  position: "top" | "bottom" | "left" | "right"
  screenshot?: string
  annotations: any[]
}

interface StepDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  step: Step | null
  onSave: (step: Step) => void
}

export function StepDialog({ open, onOpenChange, step, onSave }: StepDialogProps) {
  const [formData, setFormData] = useState<Partial<Step>>({
    title: "",
    description: "",
    selector: "",
    position: "bottom",
    annotations: [],
  })

  useEffect(() => {
    if (step) {
      setFormData(step)
    } else {
      setFormData({
        title: "",
        description: "",
        selector: "",
        position: "bottom",
        annotations: [],
      })
    }
  }, [step, open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData as Step)
  }

  const handleScreenshotSave = (screenshot: string, annotations: any[]) => {
    setFormData({ ...formData, screenshot, annotations })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white/10 backdrop-blur-sm border-white/20">
        <DialogHeader>
          <DialogTitle className="text-white">{step ? "Edit Step" : "Add New Step"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <Tabs defaultValue="details" className="mt-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="screenshot">Screenshot & Annotations</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-white">Step Title</Label>
                <Input
                  id="title"
                  placeholder="e.g., Welcome to the Dashboard"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-white">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Explain what the user should do in this step..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="selector" className="text-white">CSS Selector</Label>
                <Input
                  id="selector"
                  placeholder="e.g., #dashboard or .create-button"
                  value={formData.selector}
                  onChange={(e) => setFormData({ ...formData, selector: e.target.value })}
                  required
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                />
                <p className="text-xs text-gray-300">The element to highlight on the page</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="position" className="text-white">Tooltip Position</Label>
                <Select
                  value={formData.position}
                  onValueChange={(value: any) => setFormData({ ...formData, position: value })}
                >
                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="top">Top</SelectItem>
                    <SelectItem value="bottom">Bottom</SelectItem>
                    <SelectItem value="left">Left</SelectItem>
                    <SelectItem value="right">Right</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </TabsContent>

            <TabsContent value="screenshot" className="pt-4">
              <ScreenshotCapture
                onSave={handleScreenshotSave}
                initialScreenshot={formData.screenshot}
                initialAnnotations={formData.annotations}
              />
            </TabsContent>
          </Tabs>

          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20">
              Cancel
            </Button>
            <Button type="submit" className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20">Save Step</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
