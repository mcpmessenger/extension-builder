export interface FlowAnalysis {
  page_type: 'landing' | 'form' | 'navigation' | 'content' | 'error' | 'success' | 'unknown';
  primary_action: string;
  interactive_elements: InteractiveElement[];
  user_journey_stage: 'awareness' | 'consideration' | 'decision' | 'action' | 'support' | 'unknown';
  flow_suggestions: string[];
  accessibility_notes: string;
  tech_support_opportunities: string[];
  filename?: string; // Added for Playwright integration
  clickedElement?: string; // Added for Playwright integration
  elementIndex?: number; // Added for Playwright integration
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
  clickedElement?: string; // Added for Playwright integration
  elementIndex?: number; // Added for Playwright integration
  analysis?: FlowAnalysis; // Added for Playwright integration
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

export class FlowAnalysisService {
  private baseUrl: string;
  private playwrightBaseUrl: string;

  constructor(baseUrl?: string, playwrightBaseUrl?: string) {
    // Use dynamic host detection for mobile compatibility
    const defaultBaseUrl = typeof window !== 'undefined' 
      ? `${window.location.protocol}//${window.location.host}`
      : 'http://localhost:3000';
    
    const defaultPlaywrightBaseUrl = typeof window !== 'undefined' 
      ? `${window.location.protocol}//${window.location.hostname}:3001`
      : 'http://localhost:3001';
    
    this.baseUrl = baseUrl || defaultBaseUrl;
    this.playwrightBaseUrl = playwrightBaseUrl || defaultPlaywrightBaseUrl;
  }

  async importFlowData(sessionId: string): Promise<FlowSummary | null> {
    try {
      // Try Playwright API first, then fallback to local API
      const playwrightResponse = await fetch(`${this.playwrightBaseUrl}/api/analysis?session=${sessionId}`);
      if (playwrightResponse.ok) {
        return await playwrightResponse.json();
      }
      
      // Fallback to local API
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

  async importPlaywrightSession(sessionId: string): Promise<FlowSummary | null> {
    try {
      const response = await fetch(`${this.playwrightBaseUrl}/api/analysis?session=${sessionId}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch Playwright flow data: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error importing Playwright flow data:', error);
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

  // New method for Playwright integration
  async getPlaywrightSessions(): Promise<string[]> {
    try {
      const response = await fetch(`${this.playwrightBaseUrl}/api/sessions`);
      if (!response.ok) {
        throw new Error(`Failed to fetch sessions: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching Playwright sessions:', error);
      return [];
    }
  }

  // Enhanced method to work with Playwright analysis files
  async processPlaywrightAnalysis(analysisData: any[]): Promise<FlowSummary> {
    const analyses = analysisData.filter(analysis => analysis && analysis.page_type);
    
    return {
      session_info: {
        total_screenshots: analyses.length,
        generated_at: new Date().toISOString(),
        directory: 'playwright-analysis'
      },
      overall_flow: {
        total_steps: analyses.length,
        flow_steps: analyses.map((analysis, index) => ({
          step: index + 1,
          page_type: analysis.page_type,
          primary_action: analysis.primary_action,
          screenshot: analysis.filename?.replace('.json', '.png') || `step-${index + 1}.png`,
          clickedElement: analysis.clickedElement,
          elementIndex: analysis.elementIndex,
          analysis: analysis
        })),
        common_patterns: this.extractCommonPatterns(analyses)
      },
      page_types: this.categorizePageTypes(analyses),
      user_journey: {
        stages: analyses.map(analysis => analysis.user_journey_stage),
        progression: this.analyzeJourneyProgression(analyses.map(analysis => analysis.user_journey_stage))
      },
      tech_support_recommendations: {
        high_priority_areas: this.prioritizeSupportAreas(
          analyses.flatMap(analysis => analysis.tech_support_opportunities || [])
        ),
        common_user_challenges: this.identifyCommonChallenges(analyses),
        suggested_interventions: this.suggestInterventions(analyses)
      },
      accessibility_summary: {
        total_pages_analyzed: analyses.length,
        accessibility_concerns: this.extractAccessibilityConcerns(
          analyses.map(analysis => analysis.accessibility_notes).filter(Boolean)
        ),
        recommendations: this.generateAccessibilityRecommendations(
          analyses.map(analysis => analysis.accessibility_notes).filter(Boolean)
        )
      }
    };
  }

  private extractCommonPatterns(analyses: FlowAnalysis[]): string[] {
    const patterns = new Set<string>();
    analyses.forEach(analysis => {
      if (analysis.interactive_elements) {
        analysis.interactive_elements.forEach(element => {
          if (element.priority === 'high') {
            patterns.add(`${element.element_type}-${element.location}`);
          }
        });
      }
    });
    return Array.from(patterns);
  }

  private categorizePageTypes(analyses: FlowAnalysis[]): Record<string, number> {
    const types: Record<string, number> = {};
    analyses.forEach(analysis => {
      const type = analysis.page_type || 'unknown';
      types[type] = (types[type] || 0) + 1;
    });
    return types;
  }

  private analyzeJourneyProgression(stages: string[]): string {
    // Simple linear progression detection
    const uniqueStages = [...new Set(stages)].filter(stage => stage !== 'unknown');
    return uniqueStages.length > 1 ? 'linear' : 'single-page';
  }

  private prioritizeSupportAreas(opportunities: string[]): string[] {
    const counts: Record<string, number> = {};
    opportunities.forEach(opportunity => {
      counts[opportunity] = (counts[opportunity] || 0) + 1;
    });
    
    return Object.entries(counts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([opportunity]) => opportunity);
  }

  private identifyCommonChallenges(analyses: FlowAnalysis[]): string[] {
    const challenges = new Set<string>();
    analyses.forEach(analysis => {
      if (analysis.flow_suggestions) {
        analysis.flow_suggestions.forEach(suggestion => {
          if (suggestion.toLowerCase().includes('help') || suggestion.toLowerCase().includes('assistance')) {
            challenges.add(suggestion);
          }
        });
      }
    });
    return Array.from(challenges).slice(0, 3);
  }

  private suggestInterventions(analyses: FlowAnalysis[]): string[] {
    const interventions = new Set<string>();
    analyses.forEach(analysis => {
      if (analysis.tech_support_opportunities) {
        analysis.tech_support_opportunities.forEach(opportunity => {
          interventions.add(`Provide guidance for ${opportunity}`);
        });
      }
    });
    return Array.from(interventions).slice(0, 5);
  }

  private extractAccessibilityConcerns(notes: string[]): string[] {
    const concerns = new Set<string>();
    notes.forEach(note => {
      if (note.toLowerCase().includes('contrast')) concerns.add('Color contrast issues');
      if (note.toLowerCase().includes('alt')) concerns.add('Missing alt text');
      if (note.toLowerCase().includes('label')) concerns.add('Missing form labels');
      if (note.toLowerCase().includes('keyboard')) concerns.add('Keyboard navigation issues');
    });
    return Array.from(concerns);
  }

  private generateAccessibilityRecommendations(notes: string[]): string[] {
    const recommendations = new Set<string>();
    notes.forEach(note => {
      if (note.toLowerCase().includes('contrast')) recommendations.add('Improve color contrast ratios');
      if (note.toLowerCase().includes('alt')) recommendations.add('Add descriptive alt text');
      if (note.toLowerCase().includes('label')) recommendations.add('Associate labels with form controls');
      if (note.toLowerCase().includes('keyboard')) recommendations.add('Add keyboard navigation support');
    });
    return Array.from(recommendations);
  }
}
