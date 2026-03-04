# Figma Capture — Chrome Extension

A Chrome extension that lets you capture any web page and send it directly to Figma with one click. Works on any `http://` or `https://` page, including localhost and production sites.

## How it works

1. Click the extension icon in Chrome's toolbar
2. Click **"Capture to Figma"** in the popup
3. The capture toolbar appears — select the destination Figma file
4. Done ✓

The extension injects the Figma capture script directly via Chrome's Scripting API (`world: "MAIN"`), which **bypasses Content Security Policy** on any site. No plugin required in Figma — just be logged into [figma.com](https://figma.com) in your browser.

## Installation

Since this extension is not on the Chrome Web Store, install it in developer mode:

1. Clone this repo
2. Open `chrome://extensions` in Chrome
3. Enable **Developer mode** (top-right toggle)
4. Click **Load unpacked**
5. Select the cloned folder

## Updating the capture script

The bundled `vendor/figma-capture.js` is fetched from Figma's MCP server. To update it:

```bash
curl -s "https://mcp.figma.com/mcp/html-to-design/capture.js" -o vendor/figma-capture.js
```

Then reload the extension in `chrome://extensions`.

## Requirements

- Google Chrome (or any Chromium-based browser)
- Logged into [figma.com](https://figma.com) in your browser

## Files

```
├── manifest.json          # Chrome Extension Manifest v3
├── background.js          # Service worker (reserved for future use)
├── popup.html             # Extension popup UI
├── popup.js               # Popup logic + scripting injection
├── vendor/
│   └── figma-capture.js   # Bundled Figma capture script
└── icons/
    ├── icon.svg
    ├── icon16.png
    ├── icon32.png
    ├── icon48.png
    └── icon128.png
```
