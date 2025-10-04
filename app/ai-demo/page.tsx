'use client';

import { useState } from 'react';
import { FlowImportDialog } from '@/components/flow-import-dialog';
import { WorkflowSuggestions } from '@/components/workflow-suggestions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Sparkles, Brain, Zap, Target, Users, Camera } from 'lucide-react';
import { WorkflowSuggestion } from '@/lib/flow-analysis-service';
import Link from 'next/link';

export default function AIDemoPage() {
  const [workflowSuggestions, setWorkflowSuggestions] = useState<WorkflowSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleFlowImported = (suggestions: WorkflowSuggestion[]) => {
    setWorkflowSuggestions(suggestions);
    setShowSuggestions(true);
  };

  const handleApplySuggestion = (suggestion: WorkflowSuggestion) => {
    console.log('Applying suggestion:', suggestion);
    // In a real app, this would apply the suggestion to the workflow
  };

  const handleCustomizeSuggestion = (suggestion: WorkflowSuggestion) => {
    console.log('Customizing suggestion:', suggestion);
    // In a real app, this would open a customization dialog
  };

  return (
    <div className="min-h-screen">
      <header className="border-b border-white/10 bg-transparent backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-white flex items-center gap-2">
                <Sparkles className="h-6 w-6 text-purple-400" />
                AI-Powered Extension Builder
              </h1>
              <p className="text-sm text-gray-300">Experience intelligent workflow creation with OpenAI integration</p>
            </div>
            <FlowImportDialog onFlowImported={handleFlowImported} />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-8">
        {/* Features Overview */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">AI-Enhanced Features</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <Brain className="h-8 w-8 text-blue-400 mb-2" />
                <CardTitle className="text-white">Smart Analysis</CardTitle>
                <CardDescription className="text-gray-300">
                  AI analyzes webpage flows and identifies user journey patterns
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <Zap className="h-8 w-8 text-yellow-400 mb-2" />
                <CardTitle className="text-white">Auto Suggestions</CardTitle>
                <CardDescription className="text-gray-300">
                  Intelligent workflow suggestions based on page analysis
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <Target className="h-8 w-8 text-green-400 mb-2" />
                <CardTitle className="text-white">Contextual Help</CardTitle>
                <CardDescription className="text-gray-300">
                  Context-aware assistance and smart element highlighting
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <Users className="h-8 w-8 text-purple-400 mb-2" />
                <CardTitle className="text-white">Accessibility</CardTitle>
                <CardDescription className="text-gray-300">
                  Enhanced accessibility features and screen reader support
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>

        {/* AI Suggestions Demo */}
        {showSuggestions && (
          <div className="mb-12">
            <WorkflowSuggestions
              suggestions={workflowSuggestions}
              onApplySuggestion={handleApplySuggestion}
              onCustomizeSuggestion={handleCustomizeSuggestion}
            />
          </div>
        )}

        {/* Demo Workflow Examples */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-white mb-6">Example AI-Generated Workflows</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-white">E-commerce Checkout</CardTitle>
                <CardDescription className="text-gray-300">
                  Smart guidance through product selection and payment
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Badge variant="outline" className="bg-green-500/20 border-green-500/30 text-green-300">
                    High Priority
                  </Badge>
                  <Badge variant="outline" className="bg-blue-500/20 border-blue-500/30 text-blue-300">
                    Tech Support
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Form Assistance</CardTitle>
                <CardDescription className="text-gray-300">
                  Step-by-step form completion with validation help
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Badge variant="outline" className="bg-yellow-500/20 border-yellow-500/30 text-yellow-300">
                    Medium Priority
                  </Badge>
                  <Badge variant="outline" className="bg-purple-500/20 border-purple-500/30 text-purple-300">
                    Accessibility
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Navigation Guide</CardTitle>
                <CardDescription className="text-gray-300">
                  Intelligent site navigation and page discovery
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Badge variant="outline" className="bg-blue-500/20 border-blue-500/30 text-blue-300">
                    Low Priority
                  </Badge>
                  <Badge variant="outline" className="bg-green-500/20 border-green-500/30 text-green-300">
                    Guidance
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* How It Works */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-white mb-6">How It Works</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-500/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-300">1</span>
              </div>
              <h4 className="text-lg font-semibold text-white mb-2">Capture Screenshots</h4>
              <p className="text-gray-300">
                Use the integrated Playwright GUI to capture screenshots and generate analysis data
              </p>
            </div>

            <div className="text-center">
              <div className="bg-purple-500/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-300">2</span>
              </div>
              <h4 className="text-lg font-semibold text-white mb-2">AI Analysis</h4>
              <p className="text-gray-300">
                AI analyzes the flow data to identify patterns, challenges, and opportunities
              </p>
            </div>

            <div className="text-center">
              <div className="bg-green-500/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-300">3</span>
              </div>
              <h4 className="text-lg font-semibold text-white mb-2">Generate Extension</h4>
              <p className="text-gray-300">
                Create intelligent Chrome extensions with AI-powered guidance and assistance
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <Card className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 backdrop-blur-sm border-purple-500/30">
            <CardContent className="py-12">
              <Sparkles className="h-12 w-12 text-purple-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-4">Ready to Build AI-Powered Extensions?</h3>
              <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
                Transform your workflow creation process with intelligent analysis and automated suggestions. 
                Start building smarter, more accessible Chrome extensions today.
              </p>
              <div className="flex gap-2">
                <Link href="/playwright">
                  <Button variant="outline" className="gap-2 bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20">
                    <Camera className="h-4 w-4" />
                    Capture Screenshots
                  </Button>
                </Link>
                <FlowImportDialog onFlowImported={handleFlowImported} />
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
