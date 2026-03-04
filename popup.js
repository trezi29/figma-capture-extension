const captureBtn = document.getElementById("capture-btn")
const statusEl = document.getElementById("status")
const pageUrlEl = document.getElementById("page-url")

chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
  if (tab?.url) {
    try {
      const url = new URL(tab.url)
      pageUrlEl.textContent = url.hostname + url.pathname
    } catch {
      pageUrlEl.textContent = tab.url
    }
  }
})

captureBtn.addEventListener("click", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
  if (!tab?.id) return

  if (!tab.url?.startsWith("http")) {
    setStatus("✗ Cannot capture this page", "error")
    return
  }

  setLoading(true)
  setStatus("", "")

  try {
    // Inject the bundled capture script directly from the popup.
    // Using `files` bypasses the page's Content Security Policy entirely.
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      world: "MAIN",
      files: ["vendor/figma-capture.js"],
    })

    // Wait for window.figma to be ready, then trigger capture
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      world: "MAIN",
      func: () =>
        new Promise((resolve, reject) => {
          let attempts = 0
          const check = setInterval(() => {
            if (window.figma) {
              clearInterval(check)
              window.figma.captureForDesign({ selector: "body" })
              resolve()
            } else if (attempts++ > 40) {
              clearInterval(check)
              reject(new Error("Figma capture script not available"))
            }
          }, 100)
        }),
    })

    setStatus("✓ Capture started — check Figma", "success")
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    setStatus("✗ " + message, "error")
  } finally {
    setLoading(false)
  }
})

function setLoading(loading) {
  captureBtn.disabled = loading
  captureBtn.innerHTML = loading
    ? '<span class="spinner"></span> Capturing...'
    : `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
        <circle cx="12" cy="13" r="4"/>
      </svg> Capture to Figma`
}

function setStatus(message, type) {
  statusEl.textContent = message
  statusEl.className = "status" + (type ? " " + type : "")
}
