# Playwright GUI Integration Guide

This document describes how the Playwright screenshot capture GUI has been fully integrated into the Chrome Extension Builder application.

## Overview

The Playwright GUI has been seamlessly integrated into the extension builder, providing a unified interface for capturing screenshots, analyzing webpage flows, and generating intelligent Chrome extensions.

## Integration Components

### 1. Playwright Capture Page (`/playwright`)

**Location**: `app/playwright/page.tsx`

**Features**:
- **URL Input**: Enter target website URL for screenshot capture
- **Session Management**: Organize captures into named sessions
- **Screenshot Gallery**: View and manage captured screenshots
- **Image Editing**: Crop, annotate, and add stickers to screenshots
- **AI Integration**: Direct links to workflow generation

**Key Functionality**:
- Real-time screenshot capture with progress indicators
- Interactive image editing with crop tools and stickers
- Session-based organization of captured data
- Integration with AI workflow generation

### 2. Shared UI Components

**Location**: `components/ui/`

**Components**:
- **Modal** (`modal.tsx`): Overlay component for image editing
- **Stickers** (`stickers.tsx`): Annotation elements (circles, arrows, click indicators)

**Features**:
- Consistent styling with the extension builder theme
- Responsive design for different screen sizes
- Accessibility support with proper ARIA labels

### 3. API Endpoints

**Location**: `app/api/`

**Endpoints**:
- **Capture** (`/api/capture`): Start screenshot capture session
- **Screenshots** (`/api/screenshots`): Retrieve captured images
- **Delete** (`/api/delete`): Remove individual screenshots

**Integration Features**:
- Automatic path resolution for both local and Playwright directories
- Error handling and fallback mechanisms
- Background process management for long-running captures

### 4. Navigation Integration

**Updated Files**:
- `app/page.tsx`: Added "Screenshots" button to main navigation
- `app/ai-demo/page.tsx`: Added "Capture Screenshots" button

**Navigation Flow**:
```
Dashboard → Screenshots → AI Demo → Workflow Creation → Extension Generation
```

## Usage Workflow

### 1. Access Playwright GUI
1. From the main dashboard, click "Screenshots" button
2. Or navigate directly to `/playwright`
3. The integrated Playwright interface loads with all features

### 2. Capture Screenshots
1. Enter target URL (e.g., `https://example.com`)
2. Set session folder name (e.g., `session1`)
3. Click "Start Capture" to begin automated screenshot capture
4. System automatically clicks through interactive elements
5. Screenshots appear in real-time in the gallery

### 3. Edit and Annotate
1. Click on any screenshot to open the editor
2. Use crop tools to select specific areas
3. Add stickers (circles, arrows, click indicators)
4. Download edited screenshots for documentation

### 4. Generate AI Workflow
1. Click "Generate AI Workflow" button
2. Navigate to workflow creation with imported data
3. Review AI-generated suggestions
4. Create enhanced Chrome extension

## Technical Implementation

### File Structure
```
app/
├── playwright/
│   └── page.tsx                 # Main Playwright GUI page
├── api/
│   ├── capture/
│   │   └── route.ts            # Capture API endpoint
│   ├── screenshots/
│   │   └── route.ts            # Screenshot retrieval
│   └── delete/
│       └── route.ts            # Screenshot deletion
└── page.tsx                    # Updated dashboard with navigation

components/ui/
├── modal.tsx                   # Shared modal component
└── stickers.tsx               # Annotation stickers

PlayWright/web/                # Original Playwright app
├── scripts/
│   └── capture-clickables.mjs  # Capture script
└── public/screenshots/         # Screenshot storage
```

### API Integration

#### Capture Endpoint
```typescript
POST /api/capture
{
  "url": "https://example.com",
  "out": "session1",
  "dark": false,
  "browser": "chromium",
  "concurrency": 4,
  "delay": 1000,
  "reset": true
}
```

#### Screenshots Endpoint
```typescript
GET /api/screenshots?out=session1
Response: {
  "images": ["/screenshots/session1/001-landing.png", ...]
}
```

### Path Resolution
The system automatically resolves paths between:
- Local extension builder: `public/screenshots/`
- Playwright app: `PlayWright/web/public/screenshots/`

This ensures compatibility with both standalone and integrated usage.

## Features

### Screenshot Capture
- **Automated Clicking**: System automatically finds and clicks interactive elements
- **Multi-browser Support**: Chromium, Firefox, WebKit
- **Dark/Light Mode**: Capture in different themes
- **Concurrent Processing**: Parallel screenshot capture for speed
- **Error Recovery**: Graceful handling of failed captures

### Image Editing
- **Crop Tools**: Select and crop specific areas
- **Annotation Stickers**: Add visual indicators
- **Download Support**: Export edited images
- **Real-time Preview**: See changes immediately

### Session Management
- **Named Sessions**: Organize captures by project or website
- **Session Persistence**: Save settings between sessions
- **Bulk Operations**: Delete multiple screenshots
- **Session History**: Track capture progress

### AI Integration
- **Workflow Generation**: Direct integration with AI workflow creation
- **Analysis Ready**: Screenshots prepared for OpenAI analysis
- **Smart Suggestions**: AI-powered workflow recommendations
- **Extension Generation**: Create enhanced Chrome extensions

## Configuration

### Environment Variables
```env
# Playwright Integration
PLAYWRIGHT_SCRIPT_PATH=PlayWright/web/scripts/capture-clickables.mjs
PLAYWRIGHT_SCREENSHOTS_PATH=PlayWright/web/public/screenshots

# Extension Builder
EXTENSION_BUILDER_SCREENSHOTS_PATH=public/screenshots
```

### Dependencies
- Next.js 14+ with App Router
- Playwright for browser automation
- Node.js child processes for script execution
- File system operations for screenshot management

## Troubleshooting

### Common Issues

1. **Screenshots Not Appearing**
   - Check if Playwright script is executable
   - Verify target URL is accessible
   - Check browser permissions

2. **Capture Process Hanging**
   - Increase timeout values
   - Check target website for blocking
   - Verify Playwright installation

3. **Path Resolution Errors**
   - Ensure both screenshot directories exist
   - Check file permissions
   - Verify relative path structure

### Debug Mode
Enable debug logging by setting:
```env
DEBUG=playwright:*
```

## Future Enhancements

### Planned Features
1. **Real-time Collaboration**: Share sessions between users
2. **Advanced Editing**: More sophisticated image editing tools
3. **Batch Processing**: Process multiple URLs simultaneously
4. **Cloud Storage**: Centralized screenshot storage
5. **Version Control**: Track changes to screenshots over time

### Integration Opportunities
1. **CI/CD Integration**: Automated screenshot capture in pipelines
2. **Testing Integration**: Screenshot comparison for regression testing
3. **Documentation Generation**: Automatic documentation from screenshots
4. **Analytics Dashboard**: Usage metrics and performance tracking

## Best Practices

### Screenshot Organization
- Use descriptive session names
- Group related captures together
- Clean up old sessions regularly
- Use consistent naming conventions

### Performance Optimization
- Limit concurrent captures for large sites
- Use appropriate delay values for slow sites
- Monitor disk space for screenshot storage
- Compress images for long-term storage

### Security Considerations
- Validate target URLs before capture
- Sanitize session names to prevent path traversal
- Implement rate limiting for capture requests
- Secure screenshot storage with proper permissions

This integration provides a seamless experience for users to capture, edit, and analyze webpage screenshots while maintaining the powerful AI-driven workflow generation capabilities of the extension builder.

