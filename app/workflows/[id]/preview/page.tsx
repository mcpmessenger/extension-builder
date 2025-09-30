"use client"
import { WorkflowPreview } from "@/components/workflow-preview"
import { useRouter } from "next/navigation"

export default function PreviewPage({ params }: { params: { id: string } }) {
  const router = useRouter()

  // Mock workflow steps - in real app, fetch from database
  const steps = [
    {
      id: "1",
      title: "Welcome to the Dashboard",
      description: "This is your main dashboard where you can see all your activities and recent updates.",
      selector: "#dashboard",
      position: "bottom" as const,
      annotations: [],
    },
    {
      id: "2",
      title: "Create Your First Project",
      description: "Click here to create a new project and get started with your workflow.",
      selector: ".create-button",
      position: "right" as const,
      annotations: [],
    },
    {
      id: "3",
      title: "Access Your Settings",
      description: "Customize your experience by accessing the settings menu in the top right corner.",
      selector: "#settings",
      position: "left" as const,
      annotations: [],
    },
  ]

  return <WorkflowPreview steps={steps} onClose={() => router.push(`/workflows/${params.id}`)} />
}
