import { NextResponse } from "next/server";
import { spawn } from "node:child_process";
import path from "node:path";
import fs from "node:fs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const url = String(body.url || "https://example.com");
    const dark = Boolean(body.dark);
    const browser = String(body.browser || "chromium");
    const concurrency = Number(body.concurrency ?? 2);
    const delay = Number(body.delay ?? 800);
    const out = String(body.out || "session");

    const scriptPath = path.join(process.cwd(), "PlayWright", "web", "scripts", "capture-clickables.mjs");

    // Create screenshots directory in PlayWright/web/public/screenshots
    const screenshotsDir = path.join(process.cwd(), "PlayWright", "web", "public", "screenshots", out);
    if (!fs.existsSync(screenshotsDir)) {
      fs.mkdirSync(screenshotsDir, { recursive: true });
    }

    // Optional: clear existing folder before run
    if (body.reset === true && fs.existsSync(screenshotsDir)) {
      for (const f of fs.readdirSync(screenshotsDir)) {
        if (f.endsWith(".png")) {
          fs.unlinkSync(path.join(screenshotsDir, f));
        }
      }
    }

    const args = [
      scriptPath,
      `--url=${url}`,
      `--browser=${browser}`,
      `--dark=${dark}`,
      `--concurrency=${concurrency}`,
      `--delay=${delay}`,
      `--out=${out}`,
    ];

    // Fire-and-forget background process so client can poll for images
    const child = spawn(process.execPath, args, {
      cwd: path.join(process.cwd(), "PlayWright", "web"),
      detached: true,
      stdio: ["ignore", "pipe", "pipe"],
    });
    
    // Log output for debugging
    child.stdout?.on('data', (data) => {
      console.log('Script stdout:', data.toString());
    });
    child.stderr?.on('data', (data) => {
      console.error('Script stderr:', data.toString());
    });
    
    child.unref();

    return NextResponse.json({ ok: true, outFolder: out }, { status: 202 });
  } catch (e) {
    const message = e instanceof Error ? e.message : "unknown";
    console.error("Capture API Error:", e);
    return NextResponse.json({ ok: false, error: message, stack: e instanceof Error ? e.stack : undefined }, { status: 500 });
  }
}

