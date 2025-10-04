# Setup environment variables for the Extension Builder
Write-Host "Setting up environment variables..."

# Set OpenAI API Key (get from Vercel environment variables)
# For local development, create a .env.local file with:
# OPENAI_API_KEY=your_key_here
# NEXT_PUBLIC_OPENAI_API_KEY=your_key_here

$env:OPENAI_API_KEY = $env:OPENAI_API_KEY

# Set other environment variables
$env:OPENAI_MODEL = "gpt-4-vision-preview"
$env:ANALYSIS_MAX_TOKENS = "1000"
$env:ENABLE_ANALYSIS = "true"
$env:PLAYWRIGHT_SCRIPT_PATH = "PlayWright/web/scripts/capture-clickables.mjs"
$env:PLAYWRIGHT_SCREENSHOTS_PATH = "PlayWright/web/public/screenshots"
$env:EXTENSION_BUILDER_SCREENSHOTS_PATH = "public/screenshots"

Write-Host "Environment variables set successfully!"
if ($env:OPENAI_API_KEY) {
    Write-Host "OpenAI_API_KEY: $($env:OPENAI_API_KEY.Substring(0, 20))..."
} else {
    Write-Host "Warning: OPENAI_API_KEY not set. Create .env.local file with your OpenAI API key."
}
Write-Host "Server running on: http://localhost:3003"
