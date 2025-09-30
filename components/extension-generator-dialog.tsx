"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Download, FileCode, FileJson, FileText, CheckCircle2 } from "lucide-react"
import { generateExtensionFiles, downloadExtension } from "@/lib/extension-generator"

interface ExtensionGeneratorDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  workflow: any
}

export function ExtensionGeneratorDialog({ open, onOpenChange, workflow }: ExtensionGeneratorDialogProps) {
  const [generated, setGenerated] = useState(false)
  const [files, setFiles] = useState<Record<string, string> | null>(null)

  const handleGenerate = () => {
    const extensionFiles = generateExtensionFiles(workflow)
    setFiles(extensionFiles)
    setGenerated(true)
  }

  const handleDownload = async () => {
    await downloadExtension(workflow)
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
              <Button onClick={handleGenerate} className="mt-6">
                Generate Extension Files
              </Button>
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
