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

    // If no flow summary was found, create a mock one for demo purposes
    if (!flowSummary) {
      flowSummary = {
        session_info: {
          total_screenshots: processedFiles.length,
          generated_at: new Date().toISOString(),
          directory: uploadDir
        },
        overall_flow: {
          total_steps: 3,
          flow_steps: [
            {
              step: 1,
              page_type: 'landing',
              primary_action: 'Navigate to main page',
              screenshot: 'screenshot1.png'
            },
            {
              step: 2,
              page_type: 'form',
              primary_action: 'Fill out contact form',
              screenshot: 'screenshot2.png'
            },
            {
              step: 3,
              page_type: 'success',
              primary_action: 'Submit and confirm',
              screenshot: 'screenshot3.png'
            }
          ],
          common_patterns: ['form-filling', 'navigation', 'confirmation']
        },
        page_types: {
          'landing': 1,
          'form': 1,
          'success': 1
        },
        user_journey: {
          stages: ['awareness', 'consideration', 'action'],
          progression: 'linear'
        },
        tech_support_recommendations: {
          high_priority_areas: ['Form validation', 'Navigation clarity', 'Error handling'],
          common_user_challenges: ['Finding the right form field', 'Understanding error messages'],
          suggested_interventions: ['Add tooltips', 'Improve error messaging', 'Add progress indicators']
        },
        accessibility_summary: {
          total_pages_analyzed: processedFiles.length,
          accessibility_concerns: ['Missing alt text', 'Low contrast ratios'],
          recommendations: ['Add proper ARIA labels', 'Improve color contrast']
        }
      };
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

