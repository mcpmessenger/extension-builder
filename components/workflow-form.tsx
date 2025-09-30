"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { useRouter } from "next/navigation"

export function WorkflowForm() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    targetUrl: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would save to database
    console.log("[v0] Workflow created:", formData)
    router.push("/workflows/1")
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card className="p-6 bg-white/10 backdrop-blur-sm border-white/20">
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-white">Workflow Name</Label>
            <Input
              id="name"
              placeholder="e.g., User Onboarding Flow"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-white">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe what this workflow guides users through..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="targetUrl" className="text-white">Target Website URL</Label>
            <Input
              id="targetUrl"
              type="url"
              placeholder="https://example.com"
              value={formData.targetUrl}
              onChange={(e) => setFormData({ ...formData, targetUrl: e.target.value })}
              required
              className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
            />
            <p className="text-sm text-gray-300">The website where this workflow will be displayed</p>
          </div>
        </div>
      </Card>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={() => router.push("/")} className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20">
          Cancel
        </Button>
        <Button type="submit" className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20">Create & Add Steps</Button>
      </div>
    </form>
  )
}
