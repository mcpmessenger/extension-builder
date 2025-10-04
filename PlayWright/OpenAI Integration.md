# Developer Instructions: Playwright Screenshot App with OpenAI Integration

## Overview

This document provides comprehensive instructions for implementing OpenAI-powered webpage flow analysis in the `mcpmessenger/playwright` application. The enhancement will analyze captured screenshots to determine webpage flow patterns, which will then be consumed by the Chrome extension for intelligent tech support features.

## Implementation Plan

### Phase 1: Create OpenAI Integration Module

Create a new module to handle OpenAI Vision API interactions:

**File: `scripts/openai-analyzer.mjs`**

```javascript
#!/usr/bin/env node
import OpenAI from 'openai';
import fs from 'node:fs';
import path from 'node:path';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export class WebpageFlowAnalyzer {
  constructor() {
    this.model = 'gpt-4-vision-preview';
    this.maxTokens = 1000;
  }

  async analyzeScreenshot(imagePath, elementInfo = {}) {
    try {
      // Read and encode image
      const imageBuffer = fs.readFileSync(imagePath);
      const base64Image = imageBuffer.toString('base64');
      
      const prompt = this.buildAnalysisPrompt(elementInfo);
      
      const response = await openai.chat.completions.create({
        model: this.model,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: prompt
              },
              {
                type: 'image_url',
                image_url: {
                  url: `data:image/png;base64,${base64Image}`,
                  detail: 'high'
                }
              }
            ]
          }
        ],
        max_tokens: this.maxTokens,
        temperature: 0.1
      });

      return this.parseAnalysisResponse(response.choices[0].message.content);
    } catch (error) {
      console.error('OpenAI analysis failed:', error);
      return this.getDefaultAnalysis();
    }
  }

  buildAnalysisPrompt(elementInfo) {
    return `
Analyze this webpage screenshot and identify the user interface flow and interactive elements. 

Context: ${elementInfo.clickedElement ? `This screenshot was taken after clicking: "${elementInfo.clickedElement}"` : 'This is the initial page state'}

Please provide a JSON response with the following structure:
{
  "page_type": "landing|form|navigation|content|error|success",
  "primary_action": "description of main call-to-action",
  "interactive_elements": [
    {
      "element_type": "button|link|form|input|dropdown|checkbox",
      "description": "brief description",
      "purpose": "likely user intent",
      "priority": "high|medium|low",
      "location": "header|main|sidebar|footer"
    }
  ],
  "user_journey_stage": "awareness|consideration|decision|action|support",
  "flow_suggestions": [
    "suggested next steps for users"
  ],
  "accessibility_notes": "any accessibility concerns or features",
  "tech_support_opportunities": [
    "areas where users might need help"
  ]
}

Focus on identifying elements that would benefit from tech support guidance.
`;
  }

  parseAnalysisResponse(content) {
    try {
      // Extract JSON from response (handle cases where model adds extra text)
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      throw new Error('No valid JSON found in response');
    } catch (error) {
      console.warn('Failed to parse OpenAI response:', error);
      return this.getDefaultAnalysis();
    }
  }

  getDefaultAnalysis() {
    return {
      page_type: "unknown",
      primary_action: "Unable to determine",
      interactive_elements: [],
      user_journey_stage: "unknown",
      flow_suggestions: [],
      accessibility_notes: "Analysis unavailable",
      tech_support_opportunities: []
    };
  }

  async saveAnalysis(analysis, screenshotPath) {
    const analysisPath = screenshotPath.replace(/\.(png|jpg|jpeg)$/i, '.json');
    fs.writeFileSync(analysisPath, JSON.stringify(analysis, null, 2));
    return analysisPath;
  }
}
```

### Phase 2: Modify the Capture Script

Update `scripts/capture-clickables.mjs` to integrate OpenAI analysis:

**Key modifications needed:**

1. **Import the analyzer:**
```javascript
import { WebpageFlowAnalyzer } from './openai-analyzer.mjs';
```

2. **Initialize analyzer:**
```javascript
const analyzer = new WebpageFlowAnalyzer();
```

3. **Add analysis after each screenshot:**
```javascript
// After screenshot capture, add this:
if (process.env.OPENAI_API_KEY) {
  console.log(`Analyzing ${filename}...`);
  const elementInfo = {
    clickedElement: label,
    elementIndex: index,
    elementType: await clickable.tagName().catch(() => 'unknown')
  };
  
  const analysis = await analyzer.analyzeScreenshot(
    path.join(outDir, filename), 
    elementInfo
  );
  
  await analyzer.saveAnalysis(analysis, path.join(outDir, filename));
  console.log(`Analysis saved for ${filename}`);
}
```

### Phase 3: Add Configuration Options

Update the script to accept OpenAI-related parameters:

```javascript
const enableAnalysis = getArg("analyze", "true") === "true";
const analysisModel = getArg("model", "gpt-4-vision-preview");
```

### Phase 4: Create Analysis Summary Generator

**File: `scripts/generate-flow-summary.mjs`**

```javascript
#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

export class FlowSummaryGenerator {
  constructor(screenshotsDir) {
    this.screenshotsDir = screenshotsDir;
  }

  async generateSummary() {
    const analysisFiles = this.getAnalysisFiles();
    const analyses = this.loadAnalyses(analysisFiles);
    
    const summary = {
      session_info: {
        total_screenshots: analysisFiles.length,
        generated_at: new Date().toISOString(),
        directory: this.screenshotsDir
      },
      overall_flow: this.analyzeOverallFlow(analyses),
      page_types: this.categorizePageTypes(analyses),
      user_journey: this.mapUserJourney(analyses),
      tech_support_recommendations: this.generateTechSupportRecommendations(analyses),
      accessibility_summary: this.summarizeAccessibility(analyses)
    };

    const summaryPath = path.join(this.screenshotsDir, 'flow-summary.json');
    fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2));
    
    return summary;
  }

  getAnalysisFiles() {
    return fs.readdirSync(this.screenshotsDir)
      .filter(file => file.endsWith('.json') && file !== 'flow-summary.json')
      .sort();
  }

  loadAnalyses(files) {
    return files.map(file => {
      try {
        const content = fs.readFileSync(path.join(this.screenshotsDir, file), 'utf8');
        return { filename: file, ...JSON.parse(content) };
      } catch (error) {
        console.warn(`Failed to load analysis from ${file}:`, error);
        return null;
      }
    }).filter(Boolean);
  }

  analyzeOverallFlow(analyses) {
    const flowSteps = analyses.map((analysis, index) => ({
      step: index + 1,
      page_type: analysis.page_type,
      primary_action: analysis.primary_action,
      screenshot: analysis.filename.replace('.json', '.png')
    }));

    return {
      total_steps: flowSteps.length,
      flow_steps: flowSteps,
      common_patterns: this.identifyCommonPatterns(analyses)
    };
  }

  categorizePageTypes(analyses) {
    const types = {};
    analyses.forEach(analysis => {
      const type = analysis.page_type || 'unknown';
      types[type] = (types[type] || 0) + 1;
    });
    return types;
  }

  mapUserJourney(analyses) {
    const journeyStages = analyses.map(analysis => analysis.user_journey_stage);
    return {
      stages: journeyStages,
      progression: this.analyzeJourneyProgression(journeyStages)
    };
  }

  generateTechSupportRecommendations(analyses) {
    const allOpportunities = analyses.flatMap(analysis => 
      analysis.tech_support_opportunities || []
    );
    
    return {
      high_priority_areas: this.prioritizeSupportAreas(allOpportunities),
      common_user_challenges: this.identifyCommonChallenges(analyses),
      suggested_interventions: this.suggestInterventions(analyses)
    };
  }

  summarizeAccessibility(analyses) {
    const accessibilityNotes = analyses
      .map(analysis => analysis.accessibility_notes)
      .filter(Boolean);
    
    return {
      total_pages_analyzed: analyses.length,
      accessibility_concerns: this.extractAccessibilityConcerns(accessibilityNotes),
      recommendations: this.generateAccessibilityRecommendations(accessibilityNotes)
    };
  }

  // Helper methods for analysis
  identifyCommonPatterns(analyses) {
    // Implementation for pattern identification
    return [];
  }

  analyzeJourneyProgression(stages) {
    // Implementation for journey analysis
    return "linear"; // or "circular", "branching", etc.
  }

  prioritizeSupportAreas(opportunities) {
    // Implementation for prioritization
    return opportunities.slice(0, 5); // Top 5 for now
  }

  identifyCommonChallenges(analyses) {
    // Implementation for challenge identification
    return [];
  }

  suggestInterventions(analyses) {
    // Implementation for intervention suggestions
    return [];
  }

  extractAccessibilityConcerns(notes) {
    // Implementation for accessibility analysis
    return [];
  }

  generateAccessibilityRecommendations(notes) {
    // Implementation for accessibility recommendations
    return [];
  }
}
```

### Phase 5: Update Package.json Scripts

Add new scripts to `package.json`:

```json
{
  "scripts": {
    "capture": "node scripts/capture-clickables.mjs",
    "capture:analyze": "node scripts/capture-clickables.mjs --analyze=true",
    "generate-summary": "node scripts/generate-flow-summary.mjs",
    "analyze-existing": "node scripts/analyze-existing-screenshots.mjs"
  }
}
```

### Phase 6: Environment Configuration

Create `.env.example`:

```env
# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key_here

# Analysis Configuration
OPENAI_MODEL=gpt-4-vision-preview
ANALYSIS_MAX_TOKENS=1000
ENABLE_ANALYSIS=true
```

## Usage Instructions

### Basic Usage with Analysis

```bash
# Capture screenshots with OpenAI analysis
npm run capture:analyze -- --url=https://example.com --out=session1

# Generate flow summary
npm run generate-summary -- --dir=public/screenshots/session1
```

### Advanced Usage

```bash
# Custom configuration
npm run capture:analyze -- \
  --url=https://example.com \
  --browser=chromium \
  --dark=false \
  --concurrency=1 \
  --delay=1000 \
  --out=session1 \
  --analyze=true \
  --model=gpt-4-vision-preview
```

## API Endpoints Enhancement

Add new API endpoints to handle analysis data:

**File: `src/app/api/analysis/route.ts`**

```typescript
import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const session = searchParams.get('session');
  
  if (!session) {
    return NextResponse.json({ error: 'Session parameter required' }, { status: 400 });
  }

  const sessionDir = path.join(process.cwd(), 'public', 'screenshots', session);
  
  try {
    const summaryPath = path.join(sessionDir, 'flow-summary.json');
    if (fs.existsSync(summaryPath)) {
      const summary = JSON.parse(fs.readFileSync(summaryPath, 'utf8'));
      return NextResponse.json(summary);
    } else {
      return NextResponse.json({ error: 'Analysis not found' }, { status: 404 });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Failed to load analysis' }, { status: 500 });
  }
}
```

## Testing and Validation

### Unit Tests

Create test files for the new modules:

**File: `tests/openai-analyzer.test.js`**

```javascript
import { WebpageFlowAnalyzer } from '../scripts/openai-analyzer.mjs';
import { jest } from '@jest/globals';

describe('WebpageFlowAnalyzer', () => {
  let analyzer;

  beforeEach(() => {
    analyzer = new WebpageFlowAnalyzer();
  });

  test('should build analysis prompt correctly', () => {
    const elementInfo = { clickedElement: 'Login Button' };
    const prompt = analyzer.buildAnalysisPrompt(elementInfo);
    expect(prompt).toContain('Login Button');
  });

  test('should handle parsing errors gracefully', () => {
    const invalidJson = 'This is not JSON';
    const result = analyzer.parseAnalysisResponse(invalidJson);
    expect(result.page_type).toBe('unknown');
  });
});
```

### Integration Tests

Test the complete flow:

```bash
# Test with a known website
npm run capture:analyze -- --url=https://example.com --out=test-session

# Verify analysis files were created
ls public/screenshots/test-session/*.json

# Generate and verify summary
npm run generate-summary -- --dir=public/screenshots/test-session
```

## Deployment Considerations

### Environment Variables

Ensure the following environment variables are set in production:

- `OPENAI_API_KEY`: Your OpenAI API key
- `OPENAI_MODEL`: Model to use (default: gpt-4-vision-preview)
- `ANALYSIS_MAX_TOKENS`: Maximum tokens for analysis (default: 1000)

### Rate Limiting

Implement rate limiting for OpenAI API calls:

```javascript
// Add to openai-analyzer.mjs
import { setTimeout } from 'timers/promises';

class RateLimiter {
  constructor(requestsPerMinute = 50) {
    this.requestsPerMinute = requestsPerMinute;
    this.requests = [];
  }

  async waitIfNeeded() {
    const now = Date.now();
    this.requests = this.requests.filter(time => now - time < 60000);
    
    if (this.requests.length >= this.requestsPerMinute) {
      const oldestRequest = Math.min(...this.requests);
      const waitTime = 60000 - (now - oldestRequest);
      await setTimeout(waitTime);
    }
    
    this.requests.push(now);
  }
}
```

### Error Handling

Implement comprehensive error handling:

```javascript
// Enhanced error handling in capture script
try {
  const analysis = await analyzer.analyzeScreenshot(screenshotPath, elementInfo);
  await analyzer.saveAnalysis(analysis, screenshotPath);
} catch (error) {
  console.error(`Analysis failed for ${filename}:`, error.message);
  // Continue with next screenshot instead of failing completely
  const fallbackAnalysis = analyzer.getDefaultAnalysis();
  await analyzer.saveAnalysis(fallbackAnalysis, screenshotPath);
}
```

## Monitoring and Logging

Add comprehensive logging:

```javascript
// Enhanced logging
console.log(`[${new Date().toISOString()}] Starting analysis for ${filename}`);
console.log(`[${new Date().toISOString()}] Analysis completed: ${analysis.page_type}`);
console.log(`[${new Date().toISOString()}] Tokens used: ${response.usage?.total_tokens || 'unknown'}`);
```

## Next Steps

1. **Implement the OpenAI integration module** following the provided code structure
2. **Test thoroughly** with various websites to ensure robust analysis
3. **Optimize prompts** based on initial results to improve analysis quality
4. **Add monitoring** for API usage and costs
5. **Create documentation** for end users on how to interpret analysis results
6. **Prepare for Chrome extension integration** by ensuring JSON output format is consistent

This implementation will provide the foundation for intelligent webpage flow analysis that can be consumed by the Chrome extension for enhanced tech support capabilities.
