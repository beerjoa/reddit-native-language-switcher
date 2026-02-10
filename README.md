# Sleek Extension Boilerplate

A modern, premium browser extension boilerplate using Manifest V3, featuring a glassmorphic popup UI and a sleek 3D icon.

## Project Structure

```text
.
├── background.js         # Service Worker (Background script)
├── content-scripts/
│   └── content.js        # Content script for page manipulation
├── icons/                # Extension icons
│   ├── icon128.png
│   ├── icon48.png
│   └── icon16.png
├── manifest.json         # Extension manifest (V3)
├── popup/                # Popup UI files
│   ├── popup.html
│   ├── popup.css
│   └── popup.js
└── README.md
```

## How to Load (Chrome/Edge/Brave)

1. Open `chrome://extensions/` in your browser.
2. Enable **Developer mode** in the top right corner.
3. Click **Load unpacked**.
4. Select the `sample-extension` directory from your computer.

## How to Load (Firefox)

1. Open `about:debugging#/runtime/this-firefox` in Firefox.
2. Click **Load Temporary Add-on...**.
3. Select the `manifest.json` file from the project directory.

## Features

- **Manifest V3**: Fully compliant with modern browser standards.
- **Glassmorphic UI**: Premium popup design with blur effects and gradients.
- **Micro-animations**: Smooth transitions and hover effects.
- **Modern Typography**: Uses 'Outfit' from Google Fonts.
- **Service Worker**: Ready for background tasks.
