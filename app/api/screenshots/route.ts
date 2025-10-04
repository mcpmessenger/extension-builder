import { NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";

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

export async function GET(request: Request) {
  const url = new URL(request.url);
  const folder = url.searchParams.get("out") || "session";
  
  try {
    // Check both local public/screenshots and PlayWright/web/public/screenshots
    const localDir = path.join(process.cwd(), "public", "screenshots", folder);
    const playwrightDir = path.join(process.cwd(), "PlayWright", "web", "public", "screenshots", folder);
    
    let dir = localDir;
    
    // Prioritize Playwright directory if it exists and has files
    if (fs.existsSync(playwrightDir)) {
      const playwrightFiles = fs.readdirSync(playwrightDir).filter((f) => f.endsWith(".png"));
      if (playwrightFiles.length > 0) {
        dir = playwrightDir;
      }
    }
    
    // Fallback to local directory if Playwright has no files
    if (!fs.existsSync(dir)) {
      if (fs.existsSync(localDir)) {
        dir = localDir;
      } else {
        return NextResponse.json({ images: [] });
      }
    }
    
    const files = fs
      .readdirSync(dir)
      .filter((f) => f.endsWith(".png"))
      .sort();
    
    const images = files.map((f) => {
      // Use relative path from public directory
      if (dir === playwrightDir) {
        return path.posix.join("/screenshots", folder, f);
      } else {
        return path.posix.join("/screenshots", folder, f);
      }
    });
    
    const response = NextResponse.json({ images });
    response.headers.set('Access-Control-Allow-Origin', '*');
    return response;
  } catch (e) {
    const message = e instanceof Error ? e.message : "unknown";
    const response = NextResponse.json({ images: [], error: message }, { status: 500 });
    response.headers.set('Access-Control-Allow-Origin', '*');
    return response;
  }
}
