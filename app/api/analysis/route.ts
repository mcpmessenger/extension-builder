import { NextRequest, NextResponse } from 'next/server';
import { existsSync, readFileSync, readdirSync } from 'fs';
import path from 'path';

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('session');

    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID is required' }, { status: 400 });
    }

    // Try to load real Playwright analysis data first
    const playwrightData = await loadPlaywrightAnalysis(sessionId);
    if (playwrightData) {
      return NextResponse.json(playwrightData);
    }

    // Fallback to mock data for demo purposes
    const mockFlowSummary = {
      session_info: {
        total_screenshots: 5,
        generated_at: new Date().toISOString(),
        directory: `/public/screenshots/${sessionId}`
      },
      overall_flow: {
        total_steps: 5,
        flow_steps: [
          {
            step: 1,
            page_type: 'landing',
            primary_action: 'Navigate to homepage',
            screenshot: 'step-1.png'
          },
          {
            step: 2,
            page_type: 'navigation',
            primary_action: 'Click on products menu',
            screenshot: 'step-2.png'
          },
          {
            step: 3,
            page_type: 'content',
            primary_action: 'Browse product catalog',
            screenshot: 'step-3.png'
          },
          {
            step: 4,
            page_type: 'form',
            primary_action: 'Add item to cart',
            screenshot: 'step-4.png'
          },
          {
            step: 5,
            page_type: 'success',
            primary_action: 'Complete checkout',
            screenshot: 'step-5.png'
          }
        ],
        common_patterns: ['e-commerce', 'shopping-cart', 'checkout-flow']
      },
      page_types: {
        'landing': 1,
        'navigation': 1,
        'content': 1,
        'form': 1,
        'success': 1
      },
      user_journey: {
        stages: ['discovery', 'browsing', 'selection', 'purchase', 'completion'],
        progression: 'linear'
      },
      tech_support_recommendations: {
        high_priority_areas: [
          'Cart functionality',
          'Checkout process',
          'Product search',
          'Payment methods'
        ],
        common_user_challenges: [
          'Finding specific products',
          'Understanding cart actions',
          'Payment form completion',
          'Error message clarity'
        ],
        suggested_interventions: [
          'Add product search assistance',
          'Cart management guidance',
          'Payment form validation help',
          'Clear error explanations'
        ]
      },
      accessibility_summary: {
        total_pages_analyzed: 5,
        accessibility_concerns: [
          'Missing alt text on product images',
          'Low contrast on some buttons',
          'Form labels not properly associated'
        ],
        recommendations: [
          'Add descriptive alt text',
          'Improve color contrast ratios',
          'Associate labels with form controls',
          'Add ARIA landmarks'
        ]
      }
    };

    const response = NextResponse.json(mockFlowSummary);
    response.headers.set('Access-Control-Allow-Origin', '*');
    return response;

  } catch (error) {
    console.error('Analysis error:', error);
    const response = NextResponse.json(
      { error: 'Failed to fetch analysis data' },
      { status: 500 }
    );
    response.headers.set('Access-Control-Allow-Origin', '*');
    return response;
  }
}

async function loadPlaywrightAnalysis(sessionId: string) {
  try {
    // Look for Playwright analysis files in the PlayWright directory
    const playwrightDir = path.join(process.cwd(), 'PlayWright', 'web', 'public', 'screenshots', sessionId);
    
    if (!existsSync(playwrightDir)) {
      return null;
    }

    // Look for flow-summary.json first
    const summaryPath = path.join(playwrightDir, 'flow-summary.json');
    if (existsSync(summaryPath)) {
      const summaryData = JSON.parse(readFileSync(summaryPath, 'utf8'));
      return summaryData;
    }

    // If no summary, try to load individual analysis files
    const files = readdirSync(playwrightDir);
    const analysisFiles = files.filter(file => file.endsWith('.json'));
    
    if (analysisFiles.length === 0) {
      return null;
    }

    // Load all analysis files
    const analyses = analysisFiles.map(file => {
      try {
        const content = readFileSync(path.join(playwrightDir, file), 'utf8');
        return JSON.parse(content);
      } catch (error) {
        console.warn(`Failed to load analysis file ${file}:`, error);
        return null;
      }
    }).filter(Boolean);

    if (analyses.length === 0) {
      return null;
    }

    // Process analyses into a flow summary
    return {
      session_info: {
        total_screenshots: analyses.length,
        generated_at: new Date().toISOString(),
        directory: playwrightDir
      },
      overall_flow: {
        total_steps: analyses.length,
        flow_steps: analyses.map((analysis, index) => ({
          step: index + 1,
          page_type: analysis.page_type || 'unknown',
          primary_action: analysis.primary_action || 'Unknown action',
          screenshot: analysis.filename?.replace('.json', '.png') || `step-${index + 1}.png`,
          clickedElement: analysis.clickedElement,
          elementIndex: analysis.elementIndex,
          analysis: analysis
        })),
        common_patterns: extractCommonPatterns(analyses)
      },
      page_types: categorizePageTypes(analyses),
      user_journey: {
        stages: analyses.map(analysis => analysis.user_journey_stage || 'unknown'),
        progression: 'linear'
      },
      tech_support_recommendations: {
        high_priority_areas: prioritizeSupportAreas(
          analyses.flatMap(analysis => analysis.tech_support_opportunities || [])
        ),
        common_user_challenges: identifyCommonChallenges(analyses),
        suggested_interventions: suggestInterventions(analyses)
      },
      accessibility_summary: {
        total_pages_analyzed: analyses.length,
        accessibility_concerns: extractAccessibilityConcerns(
          analyses.map(analysis => analysis.accessibility_notes).filter(Boolean)
        ),
        recommendations: generateAccessibilityRecommendations(
          analyses.map(analysis => analysis.accessibility_notes).filter(Boolean)
        )
      }
    };
  } catch (error) {
    console.error('Error loading Playwright analysis:', error);
    return null;
  }
}

function extractCommonPatterns(analyses: any[]): string[] {
  const patterns = new Set<string>();
  analyses.forEach(analysis => {
    if (analysis.interactive_elements) {
      analysis.interactive_elements.forEach((element: any) => {
        if (element.priority === 'high') {
          patterns.add(`${element.element_type}-${element.location}`);
        }
      });
    }
  });
  return Array.from(patterns);
}

function categorizePageTypes(analyses: any[]): Record<string, number> {
  const types: Record<string, number> = {};
  analyses.forEach(analysis => {
    const type = analysis.page_type || 'unknown';
    types[type] = (types[type] || 0) + 1;
  });
  return types;
}

function prioritizeSupportAreas(opportunities: string[]): string[] {
  const counts: Record<string, number> = {};
  opportunities.forEach(opportunity => {
    counts[opportunity] = (counts[opportunity] || 0) + 1;
  });
  
  return Object.entries(counts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([opportunity]) => opportunity);
}

function identifyCommonChallenges(analyses: any[]): string[] {
  const challenges = new Set<string>();
  analyses.forEach(analysis => {
    if (analysis.flow_suggestions) {
      analysis.flow_suggestions.forEach((suggestion: string) => {
        if (suggestion.toLowerCase().includes('help') || suggestion.toLowerCase().includes('assistance')) {
          challenges.add(suggestion);
        }
      });
    }
  });
  return Array.from(challenges).slice(0, 3);
}

function suggestInterventions(analyses: any[]): string[] {
  const interventions = new Set<string>();
  analyses.forEach(analysis => {
    if (analysis.tech_support_opportunities) {
      analysis.tech_support_opportunities.forEach((opportunity: string) => {
        interventions.add(`Provide guidance for ${opportunity}`);
      });
    }
  });
  return Array.from(interventions).slice(0, 5);
}

function extractAccessibilityConcerns(notes: string[]): string[] {
  const concerns = new Set<string>();
  notes.forEach(note => {
    if (note.toLowerCase().includes('contrast')) concerns.add('Color contrast issues');
    if (note.toLowerCase().includes('alt')) concerns.add('Missing alt text');
    if (note.toLowerCase().includes('label')) concerns.add('Missing form labels');
    if (note.toLowerCase().includes('keyboard')) concerns.add('Keyboard navigation issues');
  });
  return Array.from(concerns);
}

function generateAccessibilityRecommendations(notes: string[]): string[] {
  const recommendations = new Set<string>();
  notes.forEach(note => {
    if (note.toLowerCase().includes('contrast')) recommendations.add('Improve color contrast ratios');
    if (note.toLowerCase().includes('alt')) recommendations.add('Add descriptive alt text');
    if (note.toLowerCase().includes('label')) recommendations.add('Associate labels with form controls');
    if (note.toLowerCase().includes('keyboard')) recommendations.add('Add keyboard navigation support');
  });
  return Array.from(recommendations);
}
