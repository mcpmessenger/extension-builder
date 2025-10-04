"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Download, FileCode, FileJson, FileText, CheckCircle2, Sparkles } from "lucide-react"
import { generateExtensionFiles, downloadExtension } from "@/lib/extension-generator"
import { EnhancedExtensionGenerator, EnhancedWorkflow } from "@/lib/enhanced-extension-generator"

interface ExtensionGeneratorDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  workflow: any
}

export function ExtensionGeneratorDialog({ open, onOpenChange, workflow }: ExtensionGeneratorDialogProps) {
  const [generated, setGenerated] = useState(false)
  const [files, setFiles] = useState<Record<string, string> | null>(null)
  const [useAI, setUseAI] = useState(false)

  const handleGenerate = () => {
    if (useAI) {
      // Convert to enhanced workflow with AI features
      const enhancedWorkflow: EnhancedWorkflow = {
        id: workflow.id || Date.now().toString(),
        name: workflow.name,
        description: workflow.description,
        steps: workflow.steps.map((step: any) => ({
          id: step.id,
          title: step.title,
          description: step.description,
          selector: step.selector,
          action: 'highlight' as const,
          tooltip: {
            content: step.description,
            position: step.position || 'bottom' as const
          }
        })),
        aiFeatures: {
          smartHighlighting: true,
          contextualHelp: true,
          adaptiveGuidance: true,
          accessibilitySupport: true
        }
      }
      
      const enhancedGenerator = new EnhancedExtensionGenerator()
      const extensionFiles = enhancedGenerator.generateExtensionFiles(enhancedWorkflow)
      setFiles(extensionFiles)
    } else {
      const extensionFiles = generateExtensionFiles(workflow)
      setFiles(extensionFiles)
    }
    setGenerated(true)
  }

  const handleDownload = async () => {
    if (useAI) {
      const enhancedWorkflow: EnhancedWorkflow = {
        id: workflow.id || Date.now().toString(),
        name: workflow.name,
        description: workflow.description,
        steps: workflow.steps.map((step: any) => ({
          id: step.id,
          title: step.title,
          description: step.description,
          selector: step.selector,
          action: 'highlight' as const,
          tooltip: {
            content: step.description,
            position: step.position || 'bottom' as const
          }
        })),
        aiFeatures: {
          smartHighlighting: true,
          contextualHelp: true,
          adaptiveGuidance: true,
          accessibilitySupport: true
        }
      }
      
      const enhancedGenerator = new EnhancedExtensionGenerator()
      await enhancedGenerator.downloadExtension(enhancedWorkflow)
    } else {
      await downloadExtension(workflow)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Generate Chrome Extension</DialogTitle>
        </DialogHeader>

        {!generated ? (
          <div className="py-8">
            <div className="text-center">
              <FileCode className="mx-auto h-16 w-16 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold text-foreground">Ready to Generate</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                This will create a Chrome extension ZIP package with all your workflow steps
              </p>
              
              <div className="mt-6 space-y-4">
                <div className="flex items-center justify-center gap-2">
                  <input
                    type="checkbox"
                    id="use-ai"
                    checked={useAI}
                    onChange={(e) => setUseAI(e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <label htmlFor="use-ai" className="text-sm font-medium text-foreground flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-purple-500" />
                    Enable AI-Powered Features
                  </label>
                </div>
                <p className="text-xs text-muted-foreground max-w-md mx-auto">
                  AI features include smart highlighting, contextual help, adaptive guidance, and accessibility support
                </p>
                
                <Button onClick={handleGenerate} className="gap-2">
                  <Sparkles className="h-4 w-4" />
                  Generate {useAI ? 'AI-Powered ' : ''}Extension
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-2 rounded-lg bg-green-500/10 p-4 text-green-600">
              <CheckCircle2 className="h-5 w-5" />
              <span className="text-sm font-medium">Extension generated successfully!</span>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-foreground">Generated Files:</h4>
              <div className="space-y-2">
                <Card className="flex items-center gap-3 p-3">
                  <FileJson className="h-5 w-5 text-blue-500" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">manifest.json</p>
                    <p className="text-xs text-muted-foreground">Extension configuration</p>
                  </div>
                </Card>
                <Card className="flex items-center gap-3 p-3">
                  <FileCode className="h-5 w-5 text-yellow-500" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">content.js</p>
                    <p className="text-xs text-muted-foreground">Workflow logic and UI</p>
                  </div>
                </Card>
                <Card className="flex items-center gap-3 p-3">
                  <FileText className="h-5 w-5 text-purple-500" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">styles.css</p>
                    <p className="text-xs text-muted-foreground">Tooltip and overlay styles</p>
                  </div>
                </Card>
                <Card className="flex items-center gap-3 p-3">
                  <FileCode className="h-5 w-5 text-green-500" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">background.js</p>
                    <p className="text-xs text-muted-foreground">Background service worker</p>
                  </div>
                </Card>
                {useAI && (
                  <>
                    <Card className="flex items-center gap-3 p-3">
                      <FileCode className="h-5 w-5 text-purple-500" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground">popup.html</p>
                        <p className="text-xs text-muted-foreground">AI-powered extension popup</p>
                      </div>
                    </Card>
                    <Card className="flex items-center gap-3 p-3">
                      <FileCode className="h-5 w-5 text-purple-500" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground">popup.js</p>
                        <p className="text-xs text-muted-foreground">Popup interaction logic</p>
                      </div>
                    </Card>
                  </>
                )}
              </div>
            </div>

            <div className="rounded-lg border border-border bg-muted/20 p-4">
              <h4 className="text-sm font-semibold text-foreground">Installation Instructions:</h4>
              <ol className="mt-2 space-y-1 text-sm text-muted-foreground">
                <li>1. Download the ZIP file below</li>
                <li>2. Extract the ZIP file to a folder on your computer</li>
                <li>3. Open Chrome and go to chrome://extensions/</li>
                <li>4. Enable "Developer mode"</li>
                <li>5. Click "Load unpacked" and select the extracted extension folder</li>
                <li>6. Navigate to your target website to see the workflow</li>
              </ol>
            </div>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          {generated && (
            <Button onClick={handleDownload} className="gap-2">
              <Download className="h-4 w-4" />
              Download Extension ZIP
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
