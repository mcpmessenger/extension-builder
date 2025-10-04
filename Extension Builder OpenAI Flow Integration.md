# Developer Instructions: Chrome Extension Builder with OpenAI Flow Integration

## Overview

This document provides comprehensive instructions for enhancing the `mcpmessenger/extension-builder` application to consume and utilize OpenAI-powered webpage flow analysis from the Playwright app. The enhancement will enable intelligent tech support features in generated Chrome extensions.

## Implementation Plan

### Phase 1: Data Integration Layer

Create a new service to handle flow analysis data consumption:

**File: `lib/flow-analysis-service.ts`**

```typescript
export interface FlowAnalysis {
  page_type: 'landing' | 'form' | 'navigation' | 'content' | 'error' | 'success' | 'unknown';
  primary_action: string;
  interactive_elements: InteractiveElement[];
  user_journey_stage: 'awareness' | 'consideration' | 'decision' | 'action' | 'support' | 'unknown';
  flow_suggestions: string[];
  accessibility_notes: string;
  tech_support_opportunities: string[];
}

export interface InteractiveElement {
  element_type: 'button' | 'link' | 'form' | 'input' | 'dropdown' | 'checkbox';
  description: string;
  purpose: string;
  priority: 'high' | 'medium' | 'low';
  location: 'header' | 'main' | 'sidebar' | 'footer';
}

export interface FlowSummary {
  session_info: {
    total_screenshots: number;
    generated_at: string;
    directory: string;
  };
  overall_flow: {
    total_steps: number;
    flow_steps: FlowStep[];
    common_patterns: string[];
  };
  page_types: Record<string, number>;
  user_journey: {
    stages: string[];
    progression: string;
  };
  tech_support_recommendations: {
    high_priority_areas: string[];
    common_user_challenges: string[];
    suggested_interventions: string[];
  };
  accessibility_summary: {
    total_pages_analyzed: number;
    accessibility_concerns: string[];
    recommendations: string[];
  };
}

export interface FlowStep {
  step: number;
  page_type: string;
  primary_action: string;
  screenshot: string;
}

export class FlowAnalysisService {
  private baseUrl: string;

  constructor(baseUrl: string = 'http://localhost:3000') {
    this.baseUrl = baseUrl;
  }

  async importFlowData(sessionId: string): Promise<FlowSummary | null> {
    try {
      const response = await fetch(`${this.baseUrl}/api/analysis?session=${sessionId}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch flow data: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error importing flow data:', error);
      return null;
    }
  }

  async uploadFlowData(files: FileList): Promise<FlowSummary | null> {
    try {
      const formData = new FormData();
      Array.from(files).forEach(file => {
        formData.append('files', file);
      });

      const response = await fetch('/api/flow-upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error uploading flow data:', error);
      return null;
    }
  }

  generateWorkflowSuggestions(flowSummary: FlowSummary): WorkflowSuggestion[] {
    const suggestions: WorkflowSuggestion[] = [];

    // Generate suggestions based on tech support opportunities
    flowSummary.tech_support_recommendations.high_priority_areas.forEach((area, index) => {
      suggestions.push({
        id: `tech-support-${index}`,
        title: `Tech Support: ${area}`,
        description: `Provide guidance for ${area}`,
        priority: 'high',
        category: 'tech-support',
        steps: this.generateStepsForArea(area, flowSummary)
      });
    });

    // Generate suggestions based on user journey
    if (flowSummary.user_journey.progression === 'linear') {
      suggestions.push({
        id: 'linear-guidance',
        title: 'Linear User Journey Guidance',
        description: 'Guide users through the linear flow step by step',
        priority: 'medium',
        category: 'guidance',
        steps: this.generateLinearSteps(flowSummary)
      });
    }

    // Generate accessibility-focused suggestions
    if (flowSummary.accessibility_summary.accessibility_concerns.length > 0) {
      suggestions.push({
        id: 'accessibility-support',
        title: 'Accessibility Support',
        description: 'Provide accessibility assistance for identified concerns',
        priority: 'high',
        category: 'accessibility',
        steps: this.generateAccessibilitySteps(flowSummary)
      });
    }

    return suggestions;
  }

  private generateStepsForArea(area: string, flowSummary: FlowSummary): WorkflowStep[] {
    // Implementation for generating workflow steps based on support areas
    return flowSummary.overall_flow.flow_steps.map((step, index) => ({
      id: `step-${index}`,
      title: `Step ${step.step}: ${step.primary_action}`,
      description: `Assist with ${step.primary_action} on ${step.page_type} page`,
      selector: this.generateSelectorForStep(step),
      action: 'highlight',
      tooltip: {
        content: `This is step ${step.step} in the process. ${step.primary_action}`,
        position: 'bottom'
      }
    }));
  }

  private generateLinearSteps(flowSummary: FlowSummary): WorkflowStep[] {
    return flowSummary.overall_flow.flow_steps.map((step, index) => ({
      id: `linear-step-${index}`,
      title: step.primary_action,
      description: `Complete ${step.primary_action}`,
      selector: this.generateSelectorForStep(step),
      action: 'click',
      tooltip: {
        content: step.primary_action,
        position: 'top'
      }
    }));
  }

  private generateAccessibilitySteps(flowSummary: FlowSummary): WorkflowStep[] {
    return flowSummary.accessibility_summary.recommendations.map((recommendation, index) => ({
      id: `accessibility-step-${index}`,
      title: `Accessibility: ${recommendation}`,
      description: recommendation,
      selector: '[role], [aria-label], [tabindex]',
      action: 'highlight',
      tooltip: {
        content: recommendation,
        position: 'right'
      }
    }));
  }

  private generateSelectorForStep(step: FlowStep): string {
    // Generate CSS selectors based on step information
    switch (step.page_type) {
      case 'form':
        return 'form, input, button[type="submit"]';
      case 'navigation':
        return 'nav a, .nav-link, [role="navigation"] a';
      case 'landing':
        return '.cta, .call-to-action, .hero button';
      default:
        return 'button, a, [role="button"]';
    }
  }
}

export interface WorkflowSuggestion {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  category: 'tech-support' | 'guidance' | 'accessibility';
  steps: WorkflowStep[];
}

export interface WorkflowStep {
  id: string;
  title: string;
  description: string;
  selector: string;
  action: 'click' | 'highlight' | 'input' | 'scroll';
  tooltip: {
    content: string;
    position: 'top' | 'bottom' | 'left' | 'right';
  };
}
```

### Phase 2: Enhanced Workflow Creation UI

Update the workflow creation interface to incorporate flow analysis:

**File: `components/flow-import-dialog.tsx`**

```typescript
'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, Download, Sparkles } from 'lucide-react';
import { FlowAnalysisService, FlowSummary, WorkflowSuggestion } from '@/lib/flow-analysis-service';

interface FlowImportDialogProps {
  onFlowImported: (suggestions: WorkflowSuggestion[]) => void;
}

export function FlowImportDialog({ onFlowImported }: FlowImportDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [sessionId, setSessionId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [flowSummary, setFlowSummary] = useState<FlowSummary | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);

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
        <Button variant="outline" className="gap-2">
          <Sparkles className="h-4 w-4" />
          Import AI Flow Analysis
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Import Webpage Flow Analysis</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="session" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="session">From Session ID</TabsTrigger>
            <TabsTrigger value="upload">Upload Files</TabsTrigger>
          </TabsList>
          
          <TabsContent value="session" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="session-id">Playwright Session ID</Label>
              <Input
                id="session-id"
                placeholder="Enter session ID (e.g., session1)"
                value={sessionId}
                onChange={(e) => setSessionId(e.target.value)}
              />
            </div>
            <Button 
              onClick={handleSessionImport} 
              disabled={isLoading || !sessionId.trim()}
              className="w-full gap-2"
            >
              <Download className="h-4 w-4" />
              {isLoading ? 'Importing...' : 'Import Flow Data'}
            </Button>
          </TabsContent>
          
          <TabsContent value="upload" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="file-upload">Upload Analysis Files</Label>
              <Input
                id="file-upload"
                type="file"
                multiple
                accept=".json"
                onChange={(e) => setSelectedFiles(e.target.files)}
              />
            </div>
            <Button 
              onClick={handleFileUpload} 
              disabled={isLoading || !selectedFiles}
              className="w-full gap-2"
            >
              <Upload className="h-4 w-4" />
              {isLoading ? 'Processing...' : 'Process Files'}
            </Button>
          </TabsContent>
        </Tabs>

        {flowSummary && (
          <div className="mt-4 p-4 bg-muted rounded-lg">
            <h4 className="font-semibold mb-2">Analysis Summary</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Total Steps:</span> {flowSummary.overall_flow.total_steps}
              </div>
              <div>
                <span className="font-medium">Page Types:</span> {Object.keys(flowSummary.page_types).length}
              </div>
              <div>
                <span className="font-medium">Support Areas:</span> {flowSummary.tech_support_recommendations.high_priority_areas.length}
              </div>
              <div>
                <span className="font-medium">Journey:</span> {flowSummary.user_journey.progression}
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
```

### Phase 3: AI-Powered Workflow Suggestions

Create a component to display and manage AI-generated workflow suggestions:

**File: `components/workflow-suggestions.tsx`**

```typescript
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sparkles, Plus, Eye, Settings } from 'lucide-react';
import { WorkflowSuggestion } from '@/lib/flow-analysis-service';

interface WorkflowSuggestionsProps {
  suggestions: WorkflowSuggestion[];
  onApplySuggestion: (suggestion: WorkflowSuggestion) => void;
  onCustomizeSuggestion: (suggestion: WorkflowSuggestion) => void;
}

export function WorkflowSuggestions({ 
  suggestions, 
  onApplySuggestion, 
  onCustomizeSuggestion 
}: WorkflowSuggestionsProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = ['all', ...new Set(suggestions.map(s => s.category))];
  
  const filteredSuggestions = selectedCategory === 'all' 
    ? suggestions 
    : suggestions.filter(s => s.category === selectedCategory);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'outline';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'tech-support': return '🛠️';
      case 'guidance': return '🧭';
      case 'accessibility': return '♿';
      default: return '✨';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">AI-Generated Workflow Suggestions</h3>
        </div>
        <Badge variant="outline">{suggestions.length} suggestions</Badge>
      </div>

      <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
        <TabsList>
          {categories.map(category => (
            <TabsTrigger key={category} value={category} className="capitalize">
              {category === 'all' ? 'All' : category.replace('-', ' ')}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={selectedCategory} className="space-y-4">
          {filteredSuggestions.length === 0 ? (
            <Card>
              <CardContent className="flex items-center justify-center py-8">
                <p className="text-muted-foreground">No suggestions available for this category.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {filteredSuggestions.map((suggestion) => (
                <Card key={suggestion.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="flex items-center gap-2">
                          <span>{getCategoryIcon(suggestion.category)}</span>
                          {suggestion.title}
                        </CardTitle>
                        <CardDescription>{suggestion.description}</CardDescription>
                      </div>
                      <Badge variant={getPriorityColor(suggestion.priority)}>
                        {suggestion.priority}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="text-sm text-muted-foreground">
                        <span className="font-medium">{suggestion.steps.length}</span> steps included
                      </div>
                      
                      <div className="flex gap-2">
                        <Button 
                          onClick={() => onApplySuggestion(suggestion)}
                          size="sm"
                          className="gap-2"
                        >
                          <Plus className="h-4 w-4" />
                          Apply Suggestion
                        </Button>
                        <Button 
                          onClick={() => onCustomizeSuggestion(suggestion)}
                          variant="outline"
                          size="sm"
                          className="gap-2"
                        >
                          <Settings className="h-4 w-4" />
                          Customize
                        </Button>
                        <Button 
                          variant="ghost"
                          size="sm"
                          className="gap-2"
                        >
                          <Eye className="h-4 w-4" />
                          Preview
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
```

### Phase 4: Enhanced Extension Generation

Update the extension generator to include AI-powered features:

**File: `lib/enhanced-extension-generator.tsx`**

```typescript
import { FlowSummary, WorkflowStep } from './flow-analysis-service';

export interface EnhancedWorkflow {
  id: string;
  name: string;
  description: string;
  steps: WorkflowStep[];
  flowAnalysis?: FlowSummary;
  aiFeatures: {
    smartHighlighting: boolean;
    contextualHelp: boolean;
    adaptiveGuidance: boolean;
    accessibilitySupport: boolean;
  };
}

export class EnhancedExtensionGenerator {
  generateManifest(workflow: EnhancedWorkflow): any {
    const baseManifest = {
      manifest_version: 3,
      name: workflow.name,
      version: "1.0.0",
      description: workflow.description,
      permissions: [
        "activeTab",
        "storage",
        "scripting"
      ],
      content_scripts: [
        {
          matches: ["<all_urls>"],
          js: ["content.js"],
          css: ["styles.css"],
          run_at: "document_end"
        }
      ],
      background: {
        service_worker: "background.js"
      },
      action: {
        default_popup: "popup.html",
        default_title: workflow.name
      }
    };

    // Add AI-specific permissions if needed
    if (workflow.aiFeatures.contextualHelp) {
      baseManifest.permissions.push("contextMenus");
    }

    return baseManifest;
  }

  generateContentScript(workflow: EnhancedWorkflow): string {
    return `
// Enhanced Content Script with AI Features
class AIWorkflowGuide {
  constructor() {
    this.workflow = ${JSON.stringify(workflow, null, 2)};
    this.currentStep = 0;
    this.isActive = false;
    this.flowAnalysis = this.workflow.flowAnalysis;
    this.aiFeatures = this.workflow.aiFeatures;
    
    this.init();
  }

  init() {
    this.createUI();
    this.bindEvents();
    this.loadProgress();
    
    if (this.aiFeatures.smartHighlighting) {
      this.initSmartHighlighting();
    }
    
    if (this.aiFeatures.contextualHelp) {
      this.initContextualHelp();
    }
    
    if (this.aiFeatures.adaptiveGuidance) {
      this.initAdaptiveGuidance();
    }
    
    if (this.aiFeatures.accessibilitySupport) {
      this.initAccessibilitySupport();
    }
  }

  initSmartHighlighting() {
    // Use flow analysis to intelligently highlight elements
    if (this.flowAnalysis) {
      this.flowAnalysis.overall_flow.flow_steps.forEach((step, index) => {
        const elements = document.querySelectorAll(this.getSmartSelector(step));
        elements.forEach(el => {
          el.setAttribute('data-ai-step', index.toString());
          el.setAttribute('data-ai-priority', this.getElementPriority(el, step));
        });
      });
    }
  }

  initContextualHelp() {
    // Add contextual help based on page analysis
    document.addEventListener('mouseover', (e) => {
      const element = e.target;
      const stepData = element.getAttribute('data-ai-step');
      
      if (stepData && this.aiFeatures.contextualHelp) {
        this.showContextualTooltip(element, stepData);
      }
    });
  }

  initAdaptiveGuidance() {
    // Adapt guidance based on user behavior and page type
    if (this.flowAnalysis) {
      const pageType = this.detectCurrentPageType();
      const relevantSteps = this.getRelevantStepsForPageType(pageType);
      this.adaptWorkflowForCurrentPage(relevantSteps);
    }
  }

  initAccessibilitySupport() {
    // Enhanced accessibility features
    this.addKeyboardNavigation();
    this.addScreenReaderSupport();
    this.addHighContrastMode();
  }

  getSmartSelector(step) {
    // Generate intelligent selectors based on AI analysis
    const baseSelector = step.selector || 'button, a, [role="button"]';
    
    // Enhance selector based on step context
    if (step.page_type === 'form') {
      return \`\${baseSelector}, input, select, textarea\`;
    } else if (step.page_type === 'navigation') {
      return \`nav \${baseSelector}, [role="navigation"] \${baseSelector}\`;
    }
    
    return baseSelector;
  }

  getElementPriority(element, step) {
    // Determine element priority based on AI analysis
    const rect = element.getBoundingClientRect();
    const isVisible = rect.width > 0 && rect.height > 0;
    const isInViewport = rect.top >= 0 && rect.bottom <= window.innerHeight;
    
    if (!isVisible) return 'low';
    if (isInViewport && step.priority === 'high') return 'high';
    if (isInViewport) return 'medium';
    return 'low';
  }

  detectCurrentPageType() {
    // Detect current page type using AI analysis patterns
    if (this.flowAnalysis) {
      const currentUrl = window.location.href;
      // Logic to match current page with analyzed flow steps
      return this.flowAnalysis.overall_flow.flow_steps[0]?.page_type || 'unknown';
    }
    return 'unknown';
  }

  getRelevantStepsForPageType(pageType) {
    return this.workflow.steps.filter(step => 
      !step.pageType || step.pageType === pageType
    );
  }

  adaptWorkflowForCurrentPage(relevantSteps) {
    // Adapt the workflow based on current page context
    this.workflow.steps = relevantSteps;
    this.updateUI();
  }

  showContextualTooltip(element, stepData) {
    const step = this.workflow.steps[parseInt(stepData)];
    if (!step) return;

    const tooltip = document.createElement('div');
    tooltip.className = 'ai-contextual-tooltip';
    tooltip.innerHTML = \`
      <div class="tooltip-content">
        <h4>\${step.title}</h4>
        <p>\${step.description}</p>
        <div class="tooltip-actions">
          <button onclick="workflowGuide.executeStep(\${stepData})">Execute</button>
          <button onclick="workflowGuide.skipStep(\${stepData})">Skip</button>
        </div>
      </div>
    \`;

    document.body.appendChild(tooltip);
    this.positionTooltip(tooltip, element);

    // Auto-remove after delay
    setTimeout(() => {
      if (tooltip.parentNode) {
        tooltip.parentNode.removeChild(tooltip);
      }
    }, 5000);
  }

  addKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
      if (e.altKey && e.key === 'ArrowRight') {
        this.nextStep();
      } else if (e.altKey && e.key === 'ArrowLeft') {
        this.previousStep();
      } else if (e.altKey && e.key === 'Enter') {
        this.executeCurrentStep();
      }
    });
  }

  addScreenReaderSupport() {
    // Add ARIA labels and announcements
    const announcer = document.createElement('div');
    announcer.setAttribute('aria-live', 'polite');
    announcer.setAttribute('aria-atomic', 'true');
    announcer.style.position = 'absolute';
    announcer.style.left = '-10000px';
    announcer.id = 'workflow-announcer';
    document.body.appendChild(announcer);
  }

  addHighContrastMode() {
    const style = document.createElement('style');
    style.textContent = \`
      .workflow-guide.high-contrast {
        --primary-color: #000000;
        --secondary-color: #ffffff;
        --accent-color: #ffff00;
      }
      .workflow-guide.high-contrast .tooltip {
        background: var(--secondary-color);
        color: var(--primary-color);
        border: 2px solid var(--primary-color);
      }
    \`;
    document.head.appendChild(style);
  }

  // ... rest of the workflow guide methods
  createUI() {
    // Enhanced UI creation with AI features
    const container = document.createElement('div');
    container.id = 'workflow-guide';
    container.className = 'workflow-guide';
    
    container.innerHTML = \`
      <div class="guide-header">
        <h3>\${this.workflow.name}</h3>
        <div class="guide-controls">
          <button id="ai-assist-toggle" title="Toggle AI Assistance">🤖</button>
          <button id="accessibility-toggle" title="Toggle Accessibility Mode">♿</button>
          <button id="guide-minimize" title="Minimize">−</button>
          <button id="guide-close" title="Close">×</button>
        </div>
      </div>
      <div class="guide-content">
        <div class="step-progress">
          <span id="step-counter">Step \${this.currentStep + 1} of \${this.workflow.steps.length}</span>
          <div class="progress-bar">
            <div class="progress-fill" style="width: \${(this.currentStep / this.workflow.steps.length) * 100}%"></div>
          </div>
        </div>
        <div class="step-content">
          <h4 id="step-title">\${this.getCurrentStep().title}</h4>
          <p id="step-description">\${this.getCurrentStep().description}</p>
          <div class="ai-insights" id="ai-insights"></div>
        </div>
        <div class="guide-actions">
          <button id="prev-step" \${this.currentStep === 0 ? 'disabled' : ''}>Previous</button>
          <button id="execute-step">Execute Step</button>
          <button id="next-step" \${this.currentStep === this.workflow.steps.length - 1 ? 'disabled' : ''}>Next</button>
        </div>
      </div>
    \`;
    
    document.body.appendChild(container);
    this.updateAIInsights();
  }

  updateAIInsights() {
    const insightsContainer = document.getElementById('ai-insights');
    if (!insightsContainer || !this.flowAnalysis) return;

    const currentStep = this.getCurrentStep();
    const insights = this.generateStepInsights(currentStep);
    
    insightsContainer.innerHTML = \`
      <div class="ai-insight-card">
        <h5>AI Insights</h5>
        <ul>
          \${insights.map(insight => \`<li>\${insight}</li>\`).join('')}
        </ul>
      </div>
    \`;
  }

  generateStepInsights(step) {
    const insights = [];
    
    if (this.flowAnalysis) {
      // Add insights based on flow analysis
      const relevantOpportunities = this.flowAnalysis.tech_support_recommendations.high_priority_areas
        .filter(area => area.toLowerCase().includes(step.title.toLowerCase()));
      
      if (relevantOpportunities.length > 0) {
        insights.push(\`Common challenge: \${relevantOpportunities[0]}\`);
      }
      
      // Add accessibility insights
      if (this.flowAnalysis.accessibility_summary.accessibility_concerns.length > 0) {
        insights.push('Accessibility features available for this step');
      }
      
      // Add journey context
      insights.push(\`Journey stage: \${this.flowAnalysis.user_journey.stages[this.currentStep] || 'unknown'}\`);
    }
    
    return insights;
  }

  getCurrentStep() {
    return this.workflow.steps[this.currentStep] || this.workflow.steps[0];
  }

  // ... additional methods for workflow execution
}

// Initialize the AI-powered workflow guide
const workflowGuide = new AIWorkflowGuide();
`;
  }

  generatePopupHTML(workflow: EnhancedWorkflow): string {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body {
      width: 350px;
      padding: 16px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }
    .header {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 16px;
    }
    .ai-badge {
      background: linear-gradient(45deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 2px 8px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 500;
    }
    .feature-list {
      list-style: none;
      padding: 0;
      margin: 16px 0;
    }
    .feature-list li {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 4px 0;
      font-size: 14px;
    }
    .feature-enabled {
      color: #10b981;
    }
    .feature-disabled {
      color: #6b7280;
    }
    .start-button {
      width: 100%;
      padding: 12px;
      background: linear-gradient(45deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      border-radius: 8px;
      font-weight: 500;
      cursor: pointer;
    }
    .start-button:hover {
      opacity: 0.9;
    }
  </style>
</head>
<body>
  <div class="header">
    <h2>${workflow.name}</h2>
    <span class="ai-badge">AI-Powered</span>
  </div>
  
  <p>${workflow.description}</p>
  
  <h3>AI Features</h3>
  <ul class="feature-list">
    <li class="${workflow.aiFeatures.smartHighlighting ? 'feature-enabled' : 'feature-disabled'}">
      ${workflow.aiFeatures.smartHighlighting ? '✓' : '○'} Smart Element Highlighting
    </li>
    <li class="${workflow.aiFeatures.contextualHelp ? 'feature-enabled' : 'feature-disabled'}">
      ${workflow.aiFeatures.contextualHelp ? '✓' : '○'} Contextual Help
    </li>
    <li class="${workflow.aiFeatures.adaptiveGuidance ? 'feature-enabled' : 'feature-disabled'}">
      ${workflow.aiFeatures.adaptiveGuidance ? '✓' : '○'} Adaptive Guidance
    </li>
    <li class="${workflow.aiFeatures.accessibilitySupport ? 'feature-enabled' : 'feature-disabled'}">
      ${workflow.aiFeatures.accessibilitySupport ? '✓' : '○'} Accessibility Support
    </li>
  </ul>
  
  <button class="start-button" id="start-workflow">
    Start AI-Guided Workflow
  </button>
  
  <script src="popup.js"></script>
</body>
</html>
`;
  }

  generateEnhancedStyles(): string {
    return `
/* Enhanced styles with AI features */
.workflow-guide {
  position: fixed;
  top: 20px;
  right: 20px;
  width: 320px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  z-index: 10000;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  border: 1px solid #e5e7eb;
}

.guide-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: linear-gradient(45deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 12px 12px 0 0;
}

.guide-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
}

.guide-controls {
  display: flex;
  gap: 8px;
}

.guide-controls button {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  width: 28px;
  height: 28px;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
}

.guide-controls button:hover {
  background: rgba(255, 255, 255, 0.3);
}

.guide-content {
  padding: 16px;
}

.step-progress {
  margin-bottom: 16px;
}

.step-progress span {
  font-size: 12px;
  color: #6b7280;
  font-weight: 500;
}

.progress-bar {
  width: 100%;
  height: 4px;
  background: #e5e7eb;
  border-radius: 2px;
  margin-top: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(45deg, #667eea 0%, #764ba2 100%);
  transition: width 0.3s ease;
}

.step-content h4 {
  margin: 0 0 8px 0;
  font-size: 14px;
  font-weight: 600;
  color: #111827;
}

.step-content p {
  margin: 0 0 12px 0;
  font-size: 13px;
  color: #6b7280;
  line-height: 1.4;
}

.ai-insights {
  margin: 12px 0;
}

.ai-insight-card {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 12px;
}

.ai-insight-card h5 {
  margin: 0 0 8px 0;
  font-size: 12px;
  font-weight: 600;
  color: #4f46e5;
  display: flex;
  align-items: center;
  gap: 4px;
}

.ai-insight-card h5::before {
  content: '🤖';
  font-size: 14px;
}

.ai-insight-card ul {
  margin: 0;
  padding-left: 16px;
  font-size: 12px;
  color: #64748b;
}

.ai-insight-card li {
  margin-bottom: 4px;
}

.guide-actions {
  display: flex;
  gap: 8px;
  margin-top: 16px;
}

.guide-actions button {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  background: white;
  color: #374151;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.guide-actions button:hover:not(:disabled) {
  background: #f9fafb;
  border-color: #9ca3af;
}

.guide-actions button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.guide-actions button#execute-step {
  background: linear-gradient(45deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-color: transparent;
}

.guide-actions button#execute-step:hover {
  opacity: 0.9;
}

/* AI-specific styles */
.ai-contextual-tooltip {
  position: absolute;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 10001;
  max-width: 280px;
  font-size: 13px;
}

.tooltip-content h4 {
  margin: 0 0 4px 0;
  font-size: 14px;
  font-weight: 600;
  color: #111827;
}

.tooltip-content p {
  margin: 0 0 8px 0;
  color: #6b7280;
  line-height: 1.4;
}

.tooltip-actions {
  display: flex;
  gap: 6px;
}

.tooltip-actions button {
  padding: 4px 8px;
  font-size: 11px;
  border: 1px solid #d1d5db;
  background: white;
  border-radius: 4px;
  cursor: pointer;
}

.tooltip-actions button:hover {
  background: #f9fafb;
}

/* Smart highlighting styles */
[data-ai-step] {
  position: relative;
}

[data-ai-step][data-ai-priority="high"] {
  outline: 2px solid #ef4444;
  outline-offset: 2px;
  border-radius: 4px;
}

[data-ai-step][data-ai-priority="medium"] {
  outline: 2px solid #f59e0b;
  outline-offset: 2px;
  border-radius: 4px;
}

[data-ai-step][data-ai-priority="low"] {
  outline: 1px solid #6b7280;
  outline-offset: 1px;
  border-radius: 4px;
}

/* High contrast mode */
.workflow-guide.high-contrast {
  border: 3px solid #000000;
}

.workflow-guide.high-contrast .guide-header {
  background: #000000;
  color: #ffffff;
}

.workflow-guide.high-contrast .guide-content {
  background: #ffffff;
  color: #000000;
}

.workflow-guide.high-contrast button {
  border: 2px solid #000000;
  background: #ffffff;
  color: #000000;
}

.workflow-guide.high-contrast button#execute-step {
  background: #000000;
  color: #ffffff;
}

/* Accessibility improvements */
.workflow-guide button:focus {
  outline: 2px solid #4f46e5;
  outline-offset: 2px;
}

.workflow-guide [aria-live] {
  position: absolute;
  left: -10000px;
  width: 1px;
  height: 1px;
  overflow: hidden;
}

/* Responsive design */
@media (max-width: 768px) {
  .workflow-guide {
    width: calc(100vw - 40px);
    max-width: 320px;
  }
  
  .ai-contextual-tooltip {
    max-width: calc(100vw - 40px);
  }
}

/* Animation for smooth transitions */
.workflow-guide {
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.step-content {
  transition: all 0.3s ease;
}

.ai-insight-card {
  animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
`;
  }
}
```

### Phase 5: API Endpoints for Flow Data

Create API endpoints to handle flow data upload and processing:

**File: `app/api/flow-upload/route.ts`**

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];
    
    if (files.length === 0) {
      return NextResponse.json({ error: 'No files uploaded' }, { status: 400 });
    }

    // Create upload directory
    const uploadDir = path.join(process.cwd(), 'uploads', 'flow-analysis');
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    const processedFiles = [];
    let flowSummary = null;

    for (const file of files) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      const filename = file.name;
      const filepath = path.join(uploadDir, filename);
      
      await writeFile(filepath, buffer);
      processedFiles.push(filename);

      // If this is a flow summary file, parse it
      if (filename === 'flow-summary.json') {
        try {
          flowSummary = JSON.parse(buffer.toString());
        } catch (error) {
          console.error('Error parsing flow summary:', error);
        }
      }
    }

    return NextResponse.json({
      message: 'Files uploaded successfully',
      files: processedFiles,
      flowSummary
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload files' },
      { status: 500 }
    );
  }
}
```

### Phase 6: Integration with Main Workflow Builder

Update the main workflow builder page to incorporate AI features:

**File: `app/workflows/create/page.tsx`** (modifications)

```typescript
'use client';

import { useState } from 'react';
import { FlowImportDialog } from '@/components/flow-import-dialog';
import { WorkflowSuggestions } from '@/components/workflow-suggestions';
import { WorkflowSuggestion } from '@/lib/flow-analysis-service';

export default function CreateWorkflowPage() {
  const [workflowSuggestions, setWorkflowSuggestions] = useState<WorkflowSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleFlowImported = (suggestions: WorkflowSuggestion[]) => {
    setWorkflowSuggestions(suggestions);
    setShowSuggestions(true);
  };

  const handleApplySuggestion = (suggestion: WorkflowSuggestion) => {
    // Apply the suggestion to the current workflow
    console.log('Applying suggestion:', suggestion);
    // Implementation to add steps to workflow
  };

  const handleCustomizeSuggestion = (suggestion: WorkflowSuggestion) => {
    // Open customization dialog
    console.log('Customizing suggestion:', suggestion);
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Create New Workflow</h1>
        <FlowImportDialog onFlowImported={handleFlowImported} />
      </div>

      {showSuggestions && (
        <div className="mb-8">
          <WorkflowSuggestions
            suggestions={workflowSuggestions}
            onApplySuggestion={handleApplySuggestion}
            onCustomizeSuggestion={handleCustomizeSuggestion}
          />
        </div>
      )}

      {/* Rest of the workflow creation UI */}
    </div>
  );
}
```

## Testing and Validation

### Unit Tests

Create comprehensive tests for the new AI features:

**File: `__tests__/flow-analysis-service.test.ts`**

```typescript
import { FlowAnalysisService } from '@/lib/flow-analysis-service';

describe('FlowAnalysisService', () => {
  let service: FlowAnalysisService;

  beforeEach(() => {
    service = new FlowAnalysisService();
  });

  test('should generate workflow suggestions from flow summary', () => {
    const mockFlowSummary = {
      // Mock flow summary data
    };

    const suggestions = service.generateWorkflowSuggestions(mockFlowSummary);
    expect(suggestions).toHaveLength(3); // Expected number of suggestions
    expect(suggestions[0]).toHaveProperty('id');
    expect(suggestions[0]).toHaveProperty('steps');
  });
});
```

### Integration Tests

Test the complete AI integration flow:

```bash
# Test flow import
npm run test:integration -- --testNamePattern="flow import"

# Test suggestion generation
npm run test:integration -- --testNamePattern="suggestion generation"

# Test extension generation with AI features
npm run test:integration -- --testNamePattern="enhanced extension generation"
```

## Deployment Instructions

### Environment Setup

Add the following environment variables:

```env
# Playwright Integration
PLAYWRIGHT_API_URL=http://localhost:3000
PLAYWRIGHT_SESSION_PATH=/public/screenshots

# AI Features
ENABLE_AI_FEATURES=true
AI_SUGGESTION_LIMIT=10
```

### Build Process

Update the build process to include AI features:

```json
{
  "scripts": {
    "build": "next build",
    "build:ai": "ENABLE_AI_FEATURES=true next build",
    "test:ai": "jest --testPathPattern=ai",
    "lint:ai": "eslint --ext .ts,.tsx lib/flow-analysis-service.ts components/flow-*.tsx"
  }
}
```

## Usage Instructions

### For End Users

1. **Import Flow Analysis**: Use the "Import AI Flow Analysis" button to load data from Playwright
2. **Review Suggestions**: Browse AI-generated workflow suggestions categorized by type
3. **Apply Suggestions**: Click "Apply Suggestion" to add AI-recommended steps to your workflow
4. **Customize**: Use the "Customize" option to modify suggestions before applying
5. **Generate Extension**: Create enhanced Chrome extensions with AI-powered features

### For Developers

1. **Extend AI Features**: Add new AI capabilities by extending the `FlowAnalysisService` class
2. **Custom Prompts**: Modify OpenAI prompts in the Playwright integration for better analysis
3. **New Suggestion Types**: Add new workflow suggestion categories and generation logic
4. **UI Enhancements**: Create additional components for displaying AI insights

## Next Steps

1. **Implement the core integration** following the provided code structure
2. **Test with real flow data** from the enhanced Playwright app
3. **Refine AI prompts** based on initial results and user feedback
4. **Add more AI features** such as automatic step optimization and user behavior analysis
5. **Create comprehensive documentation** for end users and developers
6. **Monitor performance** and optimize for scale

This implementation will transform the Chrome Extension Builder into an intelligent, AI-powered tool that can create sophisticated tech support extensions based on real webpage analysis data.
