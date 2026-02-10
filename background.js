// Background Service Worker
// Currently minimal as most logic is in Content Script and Popup.

chrome.runtime.onInstalled.addListener(() => {
  // Set default language execution on install if not set
  chrome.storage.sync.get(["targetLang"], (result) => {
    if (!result.targetLang) {
      chrome.storage.sync.set({ targetLang: "ko" });
      console.log("Default language set to Korean (ko)");
    }
  });
});
