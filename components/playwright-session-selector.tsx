'use client';

import { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, Database, Play } from 'lucide-react';
import { FlowAnalysisService } from '@/lib/flow-analysis-service';

interface PlaywrightSessionSelectorProps {
  onSessionSelected: (sessionId: string) => void;
  onRefresh?: () => void;
}

export function PlaywrightSessionSelector({ onSessionSelected, onRefresh }: PlaywrightSessionSelectorProps) {
  const [sessions, setSessions] = useState<string[]>([]);
  const [selectedSession, setSelectedSession] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const flowService = new FlowAnalysisService();

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    setIsLoading(true);
    try {
      const availableSessions = await flowService.getPlaywrightSessions();
      setSessions(availableSessions);
    } catch (error) {
      console.error('Failed to load sessions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadSessions();
    if (onRefresh) {
      onRefresh();
    }
    setIsRefreshing(false);
  };

  const handleSessionChange = (sessionId: string) => {
    setSelectedSession(sessionId);
    onSessionSelected(sessionId);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Database className="h-5 w-5 text-blue-400" />
          <h3 className="text-lg font-semibold text-white">Playwright Sessions</h3>
          <Badge variant="outline" className="bg-blue-500/20 border-blue-500/30 text-blue-300">
            {sessions.length} sessions
          </Badge>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="gap-2 bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          <span className="ml-2 text-gray-300">Loading sessions...</span>
        </div>
      ) : sessions.length === 0 ? (
        <div className="text-center py-8">
          <Play className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-white mb-2">No Playwright Sessions Found</h4>
          <p className="text-gray-300 mb-4">
            Run a Playwright capture session to generate analysis data.
          </p>
          <div className="text-sm text-gray-400 bg-white/5 p-4 rounded-lg">
            <p className="font-medium mb-2">To create a session:</p>
            <code className="block bg-black/20 p-2 rounded text-green-300">
              cd PlayWright/web && npm run capture -- --url=https://example.com --out=session1
            </code>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <Select value={selectedSession} onValueChange={handleSessionChange}>
            <SelectTrigger className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
              <SelectValue placeholder="Select a Playwright session..." />
            </SelectTrigger>
            <SelectContent className="bg-white/10 backdrop-blur-sm border-white/20">
              {sessions.map((session) => (
                <SelectItem 
                  key={session} 
                  value={session}
                  className="text-white focus:bg-white/20"
                >
                  <div className="flex items-center gap-2">
                    <Database className="h-4 w-4" />
                    <span>{session}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {selectedSession && (
            <div className="bg-white/5 p-4 rounded-lg border border-white/10">
              <div className="flex items-center gap-2 mb-2">
                <Play className="h-4 w-4 text-green-400" />
                <span className="text-sm font-medium text-white">Selected Session: {selectedSession}</span>
              </div>
              <p className="text-xs text-gray-400">
                This session contains Playwright screenshots and OpenAI analysis data.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

