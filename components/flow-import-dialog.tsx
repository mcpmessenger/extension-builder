'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, Download, Sparkles } from 'lucide-react';
import { FlowAnalysisService, FlowSummary, WorkflowSuggestion } from '@/lib/flow-analysis-service';
import { PlaywrightSessionSelector } from '@/components/playwright-session-selector';

interface FlowImportDialogProps {
  onFlowImported: (suggestions: WorkflowSuggestion[]) => void;
}

export function FlowImportDialog({ onFlowImported }: FlowImportDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [sessionId, setSessionId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [flowSummary, setFlowSummary] = useState<FlowSummary | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [playwrightSessionId, setPlaywrightSessionId] = useState('');

  const flowService = new FlowAnalysisService();

  const handleSessionImport = async () => {
    if (!sessionId.trim()) return;

    setIsLoading(true);
    try {
      const summary = await flowService.importFlowData(sessionId);
      if (summary) {
        setFlowSummary(summary);
        const suggestions = flowService.generateWorkflowSuggestions(summary);
        onFlowImported(suggestions);
        setIsOpen(false);
      }
    } catch (error) {
      console.error('Import failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlaywrightSessionImport = async () => {
    if (!playwrightSessionId.trim()) return;

    setIsLoading(true);
    try {
      const summary = await flowService.importPlaywrightSession(playwrightSessionId);
      if (summary) {
        setFlowSummary(summary);
        const suggestions = flowService.generateWorkflowSuggestions(summary);
        onFlowImported(suggestions);
        setIsOpen(false);
      }
    } catch (error) {
      console.error('Playwright import failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async () => {
    if (!selectedFiles) return;

    setIsLoading(true);
    try {
      const summary = await flowService.uploadFlowData(selectedFiles);
      if (summary) {
        setFlowSummary(summary);
        const suggestions = flowService.generateWorkflowSuggestions(summary);
        onFlowImported(suggestions);
        setIsOpen(false);
      }
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2 bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20">
          <Sparkles className="h-4 w-4" />
          Import AI Flow Analysis
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl bg-white/10 backdrop-blur-sm border-white/20">
        <DialogHeader>
          <DialogTitle className="text-white">Import Webpage Flow Analysis</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="playwright" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-white/10 border-white/20">
            <TabsTrigger value="playwright" className="data-[state=active]:bg-white/20 data-[state=active]:text-white text-gray-300">Playwright Sessions</TabsTrigger>
            <TabsTrigger value="session" className="data-[state=active]:bg-white/20 data-[state=active]:text-white text-gray-300">Session ID</TabsTrigger>
            <TabsTrigger value="upload" className="data-[state=active]:bg-white/20 data-[state=active]:text-white text-gray-300">Upload Files</TabsTrigger>
          </TabsList>
          
          <TabsContent value="playwright" className="space-y-4">
            <PlaywrightSessionSelector 
              onSessionSelected={(sessionId) => setPlaywrightSessionId(sessionId)}
            />
            {playwrightSessionId && (
              <Button 
                onClick={handlePlaywrightSessionImport} 
                disabled={isLoading}
                className="w-full gap-2 bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
              >
                <Download className="h-4 w-4" />
                {isLoading ? 'Importing...' : 'Import Playwright Analysis'}
              </Button>
            )}
          </TabsContent>
          
          <TabsContent value="session" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="session-id" className="text-white">Manual Session ID</Label>
              <Input
                id="session-id"
                placeholder="Enter session ID (e.g., session1)"
                value={sessionId}
                onChange={(e) => setSessionId(e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
              />
            </div>
            <Button 
              onClick={handleSessionImport} 
              disabled={isLoading || !sessionId.trim()}
              className="w-full gap-2 bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
            >
              <Download className="h-4 w-4" />
              {isLoading ? 'Importing...' : 'Import Flow Data'}
            </Button>
          </TabsContent>
          
          <TabsContent value="upload" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="file-upload" className="text-white">Upload Analysis Files</Label>
              <Input
                id="file-upload"
                type="file"
                multiple
                accept=".json"
                onChange={(e) => setSelectedFiles(e.target.files)}
                className="bg-white/10 border-white/20 text-white file:bg-white/20 file:text-white file:border-white/20"
              />
            </div>
            <Button 
              onClick={handleFileUpload} 
              disabled={isLoading || !selectedFiles}
              className="w-full gap-2 bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
            >
              <Upload className="h-4 w-4" />
              {isLoading ? 'Processing...' : 'Process Files'}
            </Button>
          </TabsContent>
        </Tabs>

        {flowSummary && (
          <div className="mt-4 p-4 bg-white/10 rounded-lg border border-white/20">
            <h4 className="font-semibold mb-2 text-white">Analysis Summary</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="text-gray-300">
                <span className="font-medium text-white">Total Steps:</span> {flowSummary.overall_flow.total_steps}
              </div>
              <div className="text-gray-300">
                <span className="font-medium text-white">Page Types:</span> {Object.keys(flowSummary.page_types).length}
              </div>
              <div className="text-gray-300">
                <span className="font-medium text-white">Support Areas:</span> {flowSummary.tech_support_recommendations.high_priority_areas.length}
              </div>
              <div className="text-gray-300">
                <span className="font-medium text-white">Journey:</span> {flowSummary.user_journey.progression}
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
