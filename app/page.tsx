import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Camera, Sparkles, Zap, Users, Globe, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="min-h-screen relative p-8">
      {/* Background overlay for text readability */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px]"></div>
      
      <div className="relative z-10 max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2">
            <h1 className="text-4xl font-bold text-white drop-shadow-2xl">
              Extension Builder
            </h1>
            <Badge variant="secondary" className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-semibold shadow-lg">
              AI-Powered
            </Badge>
          </div>
          <p className="text-xl text-white/90 max-w-2xl mx-auto drop-shadow-lg">
            Create intelligent Chrome extensions with guided workflows, AI-powered assistance, and seamless user experiences.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/workflows/new">
            <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              <Zap className="mr-2 h-5 w-5" />
              Create New Workflow
            </Button>
          </Link>
          
          <Link href="/playwright">
            <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10">
              <Camera className="mr-2 h-5 w-5" />
              Screenshots
            </Button>
          </Link>
          
          <Link href="/ai-demo">
            <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10">
              <Sparkles className="mr-2 h-5 w-5" />
              AI Demo
            </Button>
          </Link>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="bg-black/40 backdrop-blur-sm border-white/20 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white drop-shadow-lg">
                <Zap className="h-5 w-5 text-yellow-400 drop-shadow-md" />
                AI-Powered Guidance
              </CardTitle>
              <CardDescription className="text-white/80 drop-shadow-md">
                Intelligent workflow suggestions based on OpenAI analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-white/70 drop-shadow-sm">
                Leverage AI to generate smart workflow steps, contextual help, and adaptive guidance for your extensions.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-black/40 backdrop-blur-sm border-white/20 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white drop-shadow-lg">
                <Camera className="h-5 w-5 text-blue-400 drop-shadow-md" />
                Screenshot Capture
              </CardTitle>
              <CardDescription className="text-white/80 drop-shadow-md">
                Integrated Playwright screenshot and annotation tools
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-white/70 drop-shadow-sm">
                Capture, annotate, and analyze web pages with powerful screenshot tools and interactive elements.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-black/40 backdrop-blur-sm border-white/20 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white drop-shadow-lg">
                <Users className="h-5 w-5 text-green-400 drop-shadow-md" />
                User Experience
              </CardTitle>
              <CardDescription className="text-white/80 drop-shadow-md">
                Create intuitive, accessible extension interfaces
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-white/70 drop-shadow-sm">
                Build extensions with smart highlighting, contextual help, and accessibility features.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-black/40 backdrop-blur-sm border-white/20 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white drop-shadow-lg">
                <Globe className="h-5 w-5 text-purple-400 drop-shadow-md" />
                Flow Analysis
              </CardTitle>
              <CardDescription className="text-white/80 drop-shadow-md">
                Import and analyze website user flows
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-white/70 drop-shadow-sm">
                Import Playwright session data and AI analysis to create informed workflow recommendations.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-black/40 backdrop-blur-sm border-white/20 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white drop-shadow-lg">
                <Sparkles className="h-5 w-5 text-pink-400 drop-shadow-md" />
                Smart Extensions
              </CardTitle>
              <CardDescription className="text-white/80 drop-shadow-md">
                Generate intelligent Chrome extensions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-white/70 drop-shadow-sm">
                Export your workflows as fully functional Chrome extensions with AI-powered features.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-black/40 backdrop-blur-sm border-white/20 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white drop-shadow-lg">
                <ArrowRight className="h-5 w-5 text-orange-400 drop-shadow-md" />
                Quick Start
              </CardTitle>
              <CardDescription className="text-white/80 drop-shadow-md">
                Get started in minutes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-white/70 drop-shadow-sm">
                Create your first AI-powered extension with guided workflows and intelligent assistance.
              </p>
            </CardContent>
          </Card>
            </div>

        {/* Getting Started */}
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-semibold text-white drop-shadow-lg">Ready to Build?</h2>
          <p className="text-white/90 max-w-xl mx-auto drop-shadow-md">
            Start creating intelligent Chrome extensions with AI-powered workflows and seamless user experiences.
          </p>
            <Link href="/workflows/new">
            <Button size="lg" className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 shadow-lg">
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
    </div>
  );
}