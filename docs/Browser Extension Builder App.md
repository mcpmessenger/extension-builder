# System Architecture and Technical Specifications for Browser Extension Builder App

## 1. Introduction

This document outlines the proposed system architecture and technical specifications for a browser extension builder application. The primary goal of this application is to empower administrators to create guided workflow extensions for end-users, facilitating navigation and task completion within specific websites. The application will focus on capturing user interactions, generating visual aids (screenshots and GIFs), and packaging these into a deployable Chrome extension.

## 2. User Roles and Interactions

Two distinct user roles are identified:

*   **Admin (Application User):** This user interacts directly with the web-based application to design, build, and manage browser extensions. They define workflows, capture visual content, add annotations, and configure extension settings.
*   **End Website User (Extension User):** This user interacts solely with the generated Chrome extension within their browser. The extension provides step-by-step guidance for specific website workflows, utilizing the visual aids and instructions created by the Admin.

## 3. Core Components

The system will consist of two main components:

1.  **Admin Web Application:** A modern, web-based Graphical User Interface (GUI) where administrators create and manage extensions.
2.  **Generated Chrome Extension:** The output of the Admin Web Application, designed to run in the end-user's Chrome browser.

### 3.1. Admin Web Application

This component will be a web application, likely built with a modern JavaScript framework (e.g., React, Vue, Angular) to provide a rich, interactive user experience. It will feature a GUI with thin lines and text, and a dark mode theme, as requested.

#### 3.1.1. Key Features:

*   **Project Management:** Create, save, load, and manage multiple extension projects.
*   **Browser Integration:** A built-in or integrated browser environment for capturing workflows.
*   **Workflow Editor:** An intuitive interface to define and sequence workflow steps.
*   **Media Capture Tools:**
    *   **Screenshot Capture:** Ability to capture full-page screenshots or select specific cropped areas of a webpage. This will leverage browser automation capabilities.
    *   **GIF Recording:** Functionality to record short video segments (before and after interactions) and convert them into animated GIFs to visually demonstrate actions.
*   **Annotation Suite:** Tools to add various annotations to captured screenshots and GIFs:
    *   Text overlays
    *   Arrows
    *   Highlights (e.g., rectangles, circles)
    *   Redactions (to obscure sensitive information)
*   **Step Configuration:** For each workflow step, the admin can:
    *   Associate a captured screenshot/GIF.
    *   Add textual instructions.
    *   Define the target element for interaction (e.g., button, input field).
    *   Specify the type of interaction (click, type, select, hover, scroll).
*   **Extension Settings:** Configure metadata for the generated extension (name, description, version, permissions).
*   **Export/Publishing:** Generate the extension package for:
    *   

    *   Loading unpacked (for early stages/testing).
    *   Uploading to the Chrome Web Store (for production).

### 3.2. Generated Chrome Extension

This will be a standard Chrome extension, comprising a manifest file, background scripts, content scripts, and potentially a popup or options page. It will be designed to be lightweight and performant.

#### 3.2.1. Key Features:

*   **Workflow Guidance:** Presents the captured workflow steps to the end-user.
*   **Visual Cues:** Displays screenshots and GIFs at appropriate steps to guide the user.
*   **Interactive Elements:** Highlights target elements on the webpage to draw user attention.
*   **Step Navigation:** Allows users to move through the workflow steps (e.g., next, previous).
*   **Contextual Awareness:** The extension should be able to detect the current webpage and present relevant workflows.

## 4. Technical Specifications

### 4.1. Core Technologies

*   **Admin Web Application:**
    *   **Frontend:** React (or similar modern JavaScript framework) for the GUI.
    *   **Styling:** CSS-in-JS or a CSS framework for thin lines, text, and dark mode (e.g., Tailwind CSS, Styled Components).
    *   **Backend (Optional, for persistence/user management):** Node.js with Express, Python with Flask/Django, or similar. (Further clarification needed on data persistence requirements).
    *   **Browser Automation:** Potentially Puppeteer or Playwright for headless browser control within the admin app for advanced capture scenarios, or direct Chrome Extension APIs for in-browser capture.
*   **Generated Chrome Extension:**
    *   **Manifest V3:** Adhering to the latest Chrome Extension Manifest version for security and performance.
    *   **JavaScript:** For content scripts and background scripts.
    *   **HTML/CSS:** For any UI elements within the extension (e.g., popup, side panel, or injected guidance overlays).

### 4.2. Screenshot and GIF Capture Mechanism

#### 4.2.1. Screenshot Capture

*   **Full Window Capture:** Utilize `chrome.desktopCapture` API for capturing the entire screen or specific windows, giving the admin the option for full window capture.
*   **Tab-Specific Capture:** Use `chrome.tabCapture` API to capture the visible area of the current tab. This API provides a `MediaStream` of the tab's content.
*   **Cropped Area Capture:** The Admin app will provide a selection tool (e.g., a draggable/resizable overlay) within its integrated browser view. Once an area is selected, the coordinates will be used to crop the full screenshot captured via `chrome.tabCapture` or `chrome.desktopCapture`.

#### 4.2.2. GIF Recording

*   **`MediaStream` Acquisition:** Obtain a video `MediaStream` from `chrome.tabCapture` or `chrome.desktopCapture`.
*   **`MediaRecorder` API:** Use the `MediaRecorder` API to record short segments of the `MediaStream` (e.g., 1-2 seconds before and after an interaction).
*   **JavaScript GIF Encoder:** Integrate a client-side JavaScript library (e.g., `gifshot`, `gif.js`, `gifenc`, or `MediaStream-GifRecorder`) to convert the recorded video frames into an animated GIF. This process will likely run in a Web Worker to avoid blocking the main thread.

### 4.3. DOM Interaction and User Guidance

*   **Content Scripts:** The generated extension will heavily rely on content scripts injected into the target website.
*   **Element Identification:** Admins will select elements during workflow creation. The app will need to store robust selectors (e.g., unique IDs, class names, XPath, or a combination) to reliably identify these elements in the end-user's browser.
*   **Simulating Interactions:** Content scripts will programmatically simulate user actions:
    *   **Clicks:** `element.click()`
    *   **Text Input:** `element.value = 'text'; element.dispatchEvent(new Event('input')); element.dispatchEvent(new Event('change'));`
    *   **Dropdown Selection:** `element.selectedIndex = index; element.dispatchEvent(new Event('change'));`
    *   **Hover:** `element.dispatchEvent(new MouseEvent('mouseover'));`
    *   **Scroll:** `element.scrollIntoView({ behavior: 'smooth', block: 'center' });`
*   **Visual Guidance Overlays:** Content scripts will inject custom HTML/CSS elements (e.g., `div`s) as overlays to provide visual cues:
    *   **Highlighting:** Apply CSS styles (borders, background colors, box-shadows) to target elements or overlay transparent `div`s with borders.
    *   **Text Annotations:** Display instructional text next to highlighted elements.
    *   **Arrows/Shapes:** SVG or CSS-drawn arrows and shapes to direct user attention.

### 4.4. Data Storage and Persistence

*   **Admin App:** Workflow definitions, captured media (screenshots, GIFs), and extension configurations will need to be stored. Options include:
    *   **Local Storage/IndexedDB:** For client-side persistence within the admin app (simpler, but limited sharing/backup).
    *   **Cloud Storage/Database:** If multi-admin collaboration, backup, or cross-device access is required, a backend with a database (e.g., PostgreSQL, MongoDB) and cloud storage (e.g., AWS S3, Google Cloud Storage) would be necessary.
*   **Generated Extension:** The workflow data and associated media will be bundled directly into the extension package. For larger media files, external hosting (e.g., CDN) might be considered, with the extension fetching them as needed.

## 5. UI/UX Considerations

*   **Modern GUI:** Adherence to the requested aesthetic of thin lines and text. Montserrat Thin font will be used where appropriate.
*   **Dark Mode:** Full support for a dark mode theme across the Admin Web Application.
*   **Intuitive Workflow Editor:** Drag-and-drop interface for ordering steps, easy addition of media and annotations.
*   **Real-time Preview:** Ability for admins to preview the guided workflow as they build it.

## 6. Logic Gaps and Open Questions

*   **Backend Requirement:** Is a backend server required for user authentication, multi-admin collaboration, cloud storage of projects, or analytics? The current design assumes a primarily client-side admin app, but this would limit scalability and collaboration features.
*   **Advanced Interaction Capture:** How will complex interactions like drag-and-drop, canvas interactions, or iframe content be handled? These often require more sophisticated techniques or might be out of scope for an initial version.
*   **Error Handling and Robustness:** How will the generated extensions handle changes to the target website's DOM (e.g., element IDs changing, page layout updates)? Strategies like multiple selectors or AI-driven element identification could be explored.
*   **Localization:** Will the generated extensions need to support multiple languages for instructions?
*   **Performance Optimization:** How to ensure the generated extensions are lightweight and do not negatively impact the end-user's browsing experience, especially with numerous screenshots/GIFs.

This architecture provides a solid foundation for developing the browser extension builder app. The next step will be to translate these specifications into a comprehensive Technical Product Requirements Document (PRD).
