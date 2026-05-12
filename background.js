// Background Service Worker

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.get(["targetLang"], (result) => {
    if (!result.targetLang) {
      const fullLang = (navigator.language || "en").toLowerCase();
      const localeMap = { "zh-tw": "zh-Hant", "zh-hk": "zh-Hant", "zh-hant": "zh-Hant", zh: "zh-Hans", "zh-cn": "zh-Hans", "zh-hans": "zh-Hans" };
      const best = localeMap[fullLang] || fullLang.split("-")[0];
      chrome.storage.sync.set({ targetLang: best });
      console.log("Default language set to", best, "(from browser:", navigator.language, ")");
    }
  });
});
