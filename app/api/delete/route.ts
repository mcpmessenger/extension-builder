import { NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const filename = String(body.filename || "");
    const out = String(body.out || "session");

    if (!filename) {
      return NextResponse.json({ ok: false, error: "filename required" }, { status: 400 });
    }

    // Check both local and Playwright directories
    const localPath = path.join(process.cwd(), "public", "screenshots", out, filename);
    const playwrightPath = path.join(process.cwd(), "PlayWright", "web", "public", "screenshots", out, filename);
    
    let filePath = localPath;
    let found = false;
    
    // Check Playwright directory first
    if (fs.existsSync(playwrightPath)) {
      filePath = playwrightPath;
      found = true;
    } else if (fs.existsSync(localPath)) {
      filePath = localPath;
      found = true;
    }
    
    if (found) {
      fs.unlinkSync(filePath);
      return NextResponse.json({ ok: true });
    } else {
      return NextResponse.json({ ok: false, error: "file not found" }, { status: 404 });
    }
  } catch (e) {
    const message = e instanceof Error ? e.message : "unknown";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
