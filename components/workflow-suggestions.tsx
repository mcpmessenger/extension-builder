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
          <h3 className="text-lg font-semibold text-white">AI-Generated Workflow Suggestions</h3>
        </div>
        <Badge variant="outline" className="bg-white/10 border-white/20 text-white">{suggestions.length} suggestions</Badge>
      </div>

      <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
        <TabsList className="bg-white/10 border-white/20">
          {categories.map(category => (
            <TabsTrigger 
              key={category} 
              value={category} 
              className="capitalize data-[state=active]:bg-white/20 data-[state=active]:text-white text-gray-300"
            >
              {category === 'all' ? 'All' : category.replace('-', ' ')}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={selectedCategory} className="space-y-4">
          {filteredSuggestions.length === 0 ? (
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardContent className="flex items-center justify-center py-8">
                <p className="text-muted-foreground text-gray-300">No suggestions available for this category.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {filteredSuggestions.map((suggestion) => (
                <Card key={suggestion.id} className="hover:shadow-md transition-shadow bg-white/10 backdrop-blur-sm border-white/20">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="flex items-center gap-2 text-white">
                          <span>{getCategoryIcon(suggestion.category)}</span>
                          {suggestion.title}
                        </CardTitle>
                        <CardDescription className="text-gray-300">{suggestion.description}</CardDescription>
                      </div>
                      <Badge variant={getPriorityColor(suggestion.priority)} className="bg-white/10 border-white/20 text-white">
                        {suggestion.priority}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="text-sm text-muted-foreground text-gray-300">
                        <span className="font-medium text-white">{suggestion.steps.length}</span> steps included
                      </div>
                      
                      <div className="flex gap-2">
                        <Button 
                          onClick={() => onApplySuggestion(suggestion)}
                          size="sm"
                          className="gap-2 bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
                        >
                          <Plus className="h-4 w-4" />
                          Apply Suggestion
                        </Button>
                        <Button 
                          onClick={() => onCustomizeSuggestion(suggestion)}
                          variant="outline"
                          size="sm"
                          className="gap-2 bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
                        >
                          <Settings className="h-4 w-4" />
                          Customize
                        </Button>
                        <Button 
                          variant="ghost"
                          size="sm"
                          className="gap-2 text-gray-300 hover:text-white hover:bg-white/10"
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

