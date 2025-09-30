# Browser Extension Builder

A powerful Next.js application that allows you to create, design, and generate Chrome browser extensions through a visual workflow interface.

## 🚀 Features

- **Visual Workflow Editor**: Create step-by-step workflows with an intuitive drag-and-drop interface
- **Screenshot Capture**: Capture screenshots of web pages to annotate and design workflows
- **Extension Generation**: Automatically generate Chrome extension code from your workflows
- **ZIP Package Export**: Download complete extension packages ready for Chrome installation
- **Modern UI**: Built with Next.js, TypeScript, and Tailwind CSS for a modern user experience

## 🛠️ Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI + shadcn/ui
- **Icons**: Lucide React
- **Package Manager**: pnpm
- **Extension Packaging**: JSZip

## 📦 Installation

### Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/mcpmessenger/extension-builder.git
   cd extension-builder
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Start the development server**
   ```bash
   pnpm dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎯 How to Use

### Creating a Workflow

1. **Start New Workflow**: Click "New Workflow" to begin creating
2. **Add Steps**: Define each step in your workflow with:
   - Step title and description
   - CSS selector for target elements
   - Tooltip positioning
   - Action type (click, input, etc.)
3. **Capture Screenshots**: Use the built-in screenshot tool to capture and annotate web pages
4. **Preview**: Test your workflow in the preview mode

### Generating Extensions

1. **Generate Files**: Click "Generate Extension Files" in the extension dialog
2. **Download ZIP**: Download the complete extension package as a ZIP file
3. **Install in Chrome**:
   - Extract the downloaded ZIP file
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked" and select the extracted folder
   - Navigate to your target website to see the workflow

## 📁 Project Structure

```
extension-builder/
├── app/                    # Next.js app router pages
│   ├── workflows/         # Workflow management pages
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   └── workflow-*.tsx    # Workflow-specific components
├── lib/                  # Utility functions
│   └── extension-generator.tsx  # Extension code generation
├── hooks/                # Custom React hooks
└── public/               # Static assets
```

## 🎨 Extension Features

Generated Chrome extensions include:

- **Content Scripts**: Inject workflow guidance into web pages
- **Background Service Worker**: Handle extension lifecycle and communication
- **Visual Overlays**: Highlight target elements with customizable tooltips
- **Progress Tracking**: Show step-by-step progress through workflows
- **Chrome Storage**: Persist workflow completion state

## 🔧 Development

### Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint

### Code Generation

The extension generator (`lib/extension-generator.tsx`) creates:

- **manifest.json**: Chrome extension configuration
- **content.js**: Main workflow logic and DOM manipulation
- **background.js**: Service worker for extension management
- **styles.css**: Tooltip and overlay styling

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons from [Lucide](https://lucide.dev/)
- Extension packaging with [JSZip](https://stuk.github.io/jszip/)

---

**Ready to build your first browser extension?** Start by creating a new workflow and see how easy it is to turn your ideas into working Chrome extensions! 🚀
