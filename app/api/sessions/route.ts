import { NextRequest, NextResponse } from 'next/server';
import { existsSync, readdirSync } from 'fs';
import path from 'path';

export async function GET(request: NextRequest) {
  try {
    // Look for Playwright session directories
    const playwrightDir = path.join(process.cwd(), 'PlayWright', 'web', 'public', 'screenshots');
    
    if (!existsSync(playwrightDir)) {
      return NextResponse.json([]);
    }

    const sessions = readdirSync(playwrightDir, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name)
      .sort();

    return NextResponse.json(sessions);

  } catch (error) {
    console.error('Sessions error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sessions' },
      { status: 500 }
    );
  }
}

