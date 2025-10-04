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
  nextStep() {
    if (this.currentStep < this.workflow.steps.length - 1) {
      this.currentStep++;
      this.showStep(this.currentStep);
    }
  }

  previousStep() {
    if (this.currentStep > 0) {
      this.currentStep--;
      this.showStep(this.currentStep);
    }
  }

  executeCurrentStep() {
    const step = this.getCurrentStep();
    const element = document.querySelector(step.selector);
    if (element && step.action === 'click') {
      element.click();
    }
  }

  showStep(index) {
    // Implementation for showing a specific step
    this.currentStep = index;
    this.updateUI();
  }

  updateUI() {
    // Update the UI to reflect current step
    const stepCounter = document.getElementById('step-counter');
    const stepTitle = document.getElementById('step-title');
    const stepDescription = document.getElementById('step-description');
    
    if (stepCounter) stepCounter.textContent = \`Step \${this.currentStep + 1} of \${this.workflow.steps.length}\`;
    if (stepTitle) stepTitle.textContent = this.getCurrentStep().title;
    if (stepDescription) stepDescription.textContent = this.getCurrentStep().description;
    
    this.updateAIInsights();
  }

  bindEvents() {
    // Bind event listeners for UI controls
    const prevButton = document.getElementById('prev-step');
    const nextButton = document.getElementById('next-step');
    const executeButton = document.getElementById('execute-step');
    
    if (prevButton) prevButton.addEventListener('click', () => this.previousStep());
    if (nextButton) nextButton.addEventListener('click', () => this.nextStep());
    if (executeButton) executeButton.addEventListener('click', () => this.executeCurrentStep());
  }

  loadProgress() {
    // Load progress from storage
    chrome.storage.local.get(['workflowProgress'], (result) => {
      if (result.workflowProgress) {
        this.currentStep = result.workflowProgress;
        this.showStep(this.currentStep);
      }
    });
  }

  saveProgress() {
    // Save current progress
    chrome.storage.local.set({ workflowProgress: this.currentStep });
  }
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

  generatePopupScript(): string {
    return `
document.addEventListener('DOMContentLoaded', function() {
  const startButton = document.getElementById('start-workflow');
  
  if (startButton) {
    startButton.addEventListener('click', function() {
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        if (tabs[0]) {
          chrome.scripting.executeScript({
            target: {tabId: tabs[0].id},
            function: startWorkflow
          });
        }
      });
    });
  }
});

function startWorkflow() {
  if (window.workflowGuide) {
    window.workflowGuide.start();
  }
}
`;
  }

  generateBackgroundScript(): string {
    return `
chrome.runtime.onInstalled.addListener(() => {
  console.log('AI-Powered Workflow extension installed');
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'startWorkflow') {
    console.log('Starting AI-powered workflow');
  } else if (request.action === 'resetWorkflow') {
    console.log('Resetting workflow');
  } else if (request.action === 'toggleAI') {
    console.log('Toggling AI features');
  }
});

// Context menu for AI assistance
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'ai-assistance',
    title: 'Get AI Assistance',
    contexts: ['page']
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'ai-assistance') {
    chrome.tabs.sendMessage(tab.id, {action: 'showAIAssistance'});
  }
});
`;
  }

  generateExtensionFiles(workflow: EnhancedWorkflow): Record<string, string> {
    const manifest = this.generateManifest(workflow);
    const contentScript = this.generateContentScript(workflow);
    const styles = this.generateEnhancedStyles();
    const background = this.generateBackgroundScript();
    const popupHTML = this.generatePopupHTML(workflow);
    const popupScript = this.generatePopupScript();

    const files: Record<string, string> = {
      "manifest.json": JSON.stringify(manifest, null, 2),
      "content.js": contentScript,
      "styles.css": styles,
      "background.js": background,
      "popup.html": popupHTML,
      "popup.js": popupScript,
    };

    return files;
  }

  async downloadExtension(workflow: EnhancedWorkflow) {
    const files = this.generateExtensionFiles(workflow);

    // Import JSZip dynamically to avoid SSR issues
    const JSZip = (await import('jszip')).default;
    const zip = new JSZip();

    // Add all files to the ZIP
    Object.entries(files).forEach(([filename, content]) => {
      zip.file(filename, content);
    });

    // Generate the ZIP file
    const zipBlob = await zip.generateAsync({ type: 'blob' });
    
    // Create download link
    const url = URL.createObjectURL(zipBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${workflow.name.replace(/[^a-zA-Z0-9]/g, '_')}_ai_extension.zip`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}

