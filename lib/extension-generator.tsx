interface Workflow {
  id: string
  name: string
  description: string
  targetUrl: string
  steps: Step[]
}

interface Step {
  id: string
  title: string
  description: string
  selector: string
  position: "top" | "bottom" | "left" | "right"
  screenshot?: string
  annotations: any[]
}

function generateBackground() {
  return `// Background script for workflow extension
chrome.runtime.onInstalled.addListener(() => {
  console.log('Workflow extension installed');
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'startWorkflow') {
    console.log('Starting workflow');
  } else if (request.action === 'resetWorkflow') {
    console.log('Resetting workflow');
  }
});
`
}

function generateManifest(workflow: Workflow) {
  // Generate web accessible resources for images
  const webAccessibleResources = ["images/*"]
  
  return {
    manifest_version: 3,
    name: workflow.name,
    description: workflow.description,
    version: "1.0.0",
    permissions: ["activeTab", "storage"],
    host_permissions: [workflow.targetUrl + "/*"],
    content_scripts: [
      {
        matches: [workflow.targetUrl + "/*"],
        js: ["content.js"],
        css: ["styles.css"],
        run_at: "document_idle",
      },
    ],
    background: {
      service_worker: "background.js",
    },
    action: {
      default_title: workflow.name,
    },
    web_accessible_resources: [
      {
        resources: webAccessibleResources,
        matches: [workflow.targetUrl + "/*"],
      },
    ],
    icons: {
      16: "icon16.png",
      48: "icon48.png",
      128: "icon128.png",
    },
  }
}

function generateContentScript(workflow: Workflow) {
  return `// Generated Extension: ${workflow.name}
// This extension provides guided workflow steps

const WORKFLOW_DATA = ${JSON.stringify(workflow, null, 2)};

class WorkflowGuide {
  constructor() {
    this.currentStep = 0;
    this.steps = WORKFLOW_DATA.steps;
    this.overlay = null;
    this.tooltip = null;
    this.highlight = null;
    this.init();
  }

  init() {
    // Check if workflow has been completed
    chrome.storage.local.get(['workflowCompleted'], (result) => {
      if (!result.workflowCompleted) {
        this.start();
      }
    });

    // Listen for messages from background script
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      if (request.action === 'startWorkflow') {
        this.start();
      } else if (request.action === 'resetWorkflow') {
        this.reset();
      }
    });
  }

  start() {
    if (this.steps.length === 0) return;
    this.showStep(0);
  }

  showStep(index) {
    if (index >= this.steps.length) {
      this.complete();
      return;
    }

    this.currentStep = index;
    const step = this.steps[index];

    // Remove existing overlay and tooltip
    this.cleanup();

    // Wait for element to be available
    this.waitForElement(step.selector, (element) => {
      this.highlightElement(element, step);
      this.showTooltip(element, step);
    });
  }

  waitForElement(selector, callback, timeout = 5000) {
    const startTime = Date.now();
    
    const checkElement = () => {
      const element = document.querySelector(selector);
      if (element) {
        callback(element);
      } else if (Date.now() - startTime < timeout) {
        setTimeout(checkElement, 100);
      } else {
        console.warn('Element not found:', selector);
        this.showTooltip(document.body, this.steps[this.currentStep]);
      }
    };
    
    checkElement();
  }

  highlightElement(element, step) {
    // Create overlay
    this.overlay = document.createElement('div');
    this.overlay.className = 'workflow-overlay';
    document.body.appendChild(this.overlay);

    // Create highlight
    const rect = element.getBoundingClientRect();
    const highlight = document.createElement('div');
    highlight.className = 'workflow-highlight';
    highlight.style.top = rect.top + window.scrollY + 'px';
    highlight.style.left = rect.left + window.scrollX + 'px';
    highlight.style.width = rect.width + 'px';
    highlight.style.height = rect.height + 'px';
    document.body.appendChild(highlight);
    this.highlight = highlight;
  }

  showTooltip(element, step) {
    const rect = element.getBoundingClientRect();
    
    this.tooltip = document.createElement('div');
    this.tooltip.className = 'workflow-tooltip workflow-tooltip-' + step.position;
    
    // Get the image path for this step
    const stepIndex = this.currentStep;
    const imagePath = step.screenshot ? \`images/step-\${stepIndex + 1}-screenshot.png\` : null;
    
    this.tooltip.innerHTML = \`
      <div class="workflow-tooltip-header">
        <span class="workflow-tooltip-progress">Step \${this.currentStep + 1} of \${this.steps.length}</span>
        <button class="workflow-tooltip-close" onclick="window.workflowGuide.skip()">&times;</button>
      </div>
      <h3 class="workflow-tooltip-title">\${step.title}</h3>
      <p class="workflow-tooltip-description">\${step.description}</p>
      \${imagePath ? \`<img src="\${chrome.runtime.getURL(imagePath)}" class="workflow-tooltip-screenshot" />\` : ''}
      <div class="workflow-tooltip-actions">
        \${this.currentStep > 0 ? '<button class="workflow-btn workflow-btn-secondary" onclick="window.workflowGuide.previous()">Previous</button>' : ''}
        <button class="workflow-btn workflow-btn-primary" onclick="window.workflowGuide.next()">
          \${this.currentStep === this.steps.length - 1 ? 'Finish' : 'Next'}
        </button>
      </div>
    \`;

    document.body.appendChild(this.tooltip);
    this.positionTooltip(element, step.position);
  }

  positionTooltip(element, position) {
    const rect = element.getBoundingClientRect();
    const tooltipRect = this.tooltip.getBoundingClientRect();
    const padding = 16;

    let top, left;

    switch (position) {
      case 'top':
        top = rect.top + window.scrollY - tooltipRect.height - padding;
        left = rect.left + window.scrollX + (rect.width - tooltipRect.width) / 2;
        break;
      case 'bottom':
        top = rect.bottom + window.scrollY + padding;
        left = rect.left + window.scrollX + (rect.width - tooltipRect.width) / 2;
        break;
      case 'left':
        top = rect.top + window.scrollY + (rect.height - tooltipRect.height) / 2;
        left = rect.left + window.scrollX - tooltipRect.width - padding;
        break;
      case 'right':
        top = rect.top + window.scrollY + (rect.height - tooltipRect.height) / 2;
        left = rect.right + window.scrollX + padding;
        break;
    }

    this.tooltip.style.top = Math.max(padding, top) + 'px';
    this.tooltip.style.left = Math.max(padding, left) + 'px';
  }

  next() {
    this.showStep(this.currentStep + 1);
  }

  previous() {
    if (this.currentStep > 0) {
      this.showStep(this.currentStep - 1);
    }
  }

  skip() {
    this.cleanup();
    chrome.storage.local.set({ workflowCompleted: true });
  }

  complete() {
    this.cleanup();
    chrome.storage.local.set({ workflowCompleted: true });
    
    // Show completion message
    const completion = document.createElement('div');
    completion.className = 'workflow-completion';
    completion.innerHTML = \`
      <div class="workflow-completion-content">
        <h3>Workflow Complete!</h3>
        <p>You've completed the guided tour.</p>
        <button class="workflow-btn workflow-btn-primary" onclick="this.parentElement.parentElement.remove()">Close</button>
      </div>
    \`;
    document.body.appendChild(completion);
    
    setTimeout(() => {
      completion.remove();
    }, 5000);
  }

  cleanup() {
    if (this.overlay) {
      this.overlay.remove();
      this.overlay = null;
    }
    if (this.highlight) {
      this.highlight.remove();
      this.highlight = null;
    }
    if (this.tooltip) {
      this.tooltip.remove();
      this.tooltip = null;
    }
  }

  reset() {
    chrome.storage.local.remove('workflowCompleted');
    this.start();
  }
}

// Initialize workflow guide
window.workflowGuide = new WorkflowGuide();
`
}

function generateStyles() {
  return `.workflow-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 9998;
}

.workflow-highlight {
  position: absolute;
  border: 2px solid #3b82f6;
  border-radius: 4px;
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.2);
  z-index: 9999;
  pointer-events: none;
}

.workflow-tooltip {
  position: absolute;
  background-color: #fff;
  border: 1px solid #e5e7eb;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  padding: 20px;
  border-radius: 8px;
  z-index: 10000;
  max-width: 400px;
  font-family: system-ui, -apple-system, sans-serif;
}

.workflow-tooltip-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.workflow-tooltip-progress {
  font-size: 12px;
  color: #6b7280;
  font-weight: 500;
}

.workflow-tooltip-close {
  background: none;
  border: none;
  font-size: 24px;
  color: #9ca3af;
  cursor: pointer;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
}

.workflow-tooltip-close:hover {
  color: #374151;
}

.workflow-tooltip-title {
  margin: 0 0 8px 0;
  font-size: 18px;
  font-weight: 600;
  color: #111827;
}

.workflow-tooltip-description {
  margin: 0 0 16px 0;
  font-size: 14px;
  color: #4b5563;
  line-height: 1.5;
}

.workflow-tooltip-screenshot {
  max-width: 100%;
  border-radius: 6px;
  margin-bottom: 16px;
  border: 1px solid #e5e7eb;
}

.workflow-tooltip-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

.workflow-btn {
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  border: none;
  transition: all 0.2s;
}

.workflow-btn-primary {
  background-color: #3b82f6;
  color: #fff;
}

.workflow-btn-primary:hover {
  background-color: #2563eb;
}

.workflow-btn-secondary {
  background-color: #f3f4f6;
  color: #374151;
}

.workflow-btn-secondary:hover {
  background-color: #e5e7eb;
}

.workflow-completion {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;
  border: 1px solid #e5e7eb;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  padding: 32px;
  border-radius: 12px;
  z-index: 10001;
  text-align: center;
}

.workflow-completion-content h3 {
  margin: 0 0 8px 0;
  font-size: 20px;
  font-weight: 600;
  color: #111827;
}

.workflow-completion-content p {
  margin: 0 0 20px 0;
  font-size: 14px;
  color: #6b7280;
}
`
}

export function generateExtensionFiles(workflow: Workflow) {
  const manifest = generateManifest(workflow)
  const contentScript = generateContentScript(workflow)
  const styles = generateStyles()
  const background = generateBackground()

  const files: Record<string, string> = {
    "manifest.json": JSON.stringify(manifest, null, 2),
    "content.js": contentScript,
    "styles.css": styles,
    "background.js": background,
  }

  // Add media files for steps with screenshots
  workflow.steps.forEach((step, index) => {
    if (step.screenshot) {
      // Extract the base64 data from data URL
      const base64Data = step.screenshot.replace(/^data:image\/[a-z]+;base64,/, '')
      const extension = step.screenshot.match(/^data:image\/([a-z]+);base64,/)?.[1] || 'png'
      files[`images/step-${index + 1}-screenshot.${extension}`] = base64Data
    }
  })

  return files
}

export async function downloadExtension(workflow: Workflow) {
  const files = generateExtensionFiles(workflow)

  // Import JSZip dynamically to avoid SSR issues
  const JSZip = (await import('jszip')).default
  const zip = new JSZip()

  // Add all files to the ZIP
  Object.entries(files).forEach(([filename, content]) => {
    if (filename.startsWith('images/')) {
      // Handle binary data for images
      zip.file(filename, content, { base64: true })
    } else {
      // Handle text files
      zip.file(filename, content)
    }
  })

  // Generate the ZIP file
  const zipBlob = await zip.generateAsync({ type: 'blob' })
  
  // Create download link
  const url = URL.createObjectURL(zipBlob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${workflow.name.replace(/[^a-zA-Z0-9]/g, '_')}_extension.zip`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
