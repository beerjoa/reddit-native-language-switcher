// Background service worker for Sleek Extension Boilerplate

chrome.runtime.onInstalled.addListener(() => {
  console.log("Sleek Extension Boilerplate installed.");
});

// Example of handling messages from popup or content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "PING") {
    sendResponse({ status: "PONG" });
  }
  return true;
});
