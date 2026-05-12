"use strict";
document.addEventListener("DOMContentLoaded", () => {
  const enableToggle = document.getElementById("enableToggle");
  const languageSelect = document.getElementById("language");
  const statusDiv = document.getElementById("status");

  if (!enableToggle || !languageSelect || !statusDiv) return;

  if (typeof SUPPORTED_LANGUAGES === "undefined" || !SUPPORTED_LANGUAGES.length) {
    statusDiv.textContent = "Language data unavailable.";
    return;
  }

  // ── 1. Populate language dropdown from SUPPORTED_LANGUAGES (languages.js) ──
  SUPPORTED_LANGUAGES.forEach(({ code, nativeName, englishName }) => {
    const option = document.createElement("option");
    option.value = code;
    option.textContent = `${nativeName} (${englishName})`;
    languageSelect.appendChild(option);
  });

  // ── 2. Browser language detection ──
  function getBrowserLang() {
    const full = (navigator.language || "en").toLowerCase();
    const localeMap = {
      "zh-tw": "zh-Hant", "zh-hk": "zh-Hant", "zh-hant": "zh-Hant",
      zh: "zh-Hans", "zh-cn": "zh-Hans", "zh-hans": "zh-Hans",
    };
    if (localeMap[full]) return localeMap[full];
    return full.split("-")[0];
  }

  function findBestMatch(browserLang) {
    const lower = browserLang.toLowerCase();
    const exact = SUPPORTED_LANGUAGES.find(
      (l) => l.code.toLowerCase() === lower
    );
    if (exact) return exact.code;
    const prefix = SUPPORTED_LANGUAGES.find(
      (l) => l.code.toLowerCase().startsWith(lower)
    );
    if (prefix) return prefix.code;
    return SUPPORTED_LANGUAGES[0]?.code ?? "en";
  }

  // ── 3. Load saved settings ──
  chrome.storage.sync.get(["targetLang", "isEnabled"], (result) => {
    const browserLang = getBrowserLang();
    if (result.targetLang) {
      const matched = SUPPORTED_LANGUAGES.find(
        (l) => l.code === result.targetLang
      );
      languageSelect.value = matched
        ? matched.code
        : findBestMatch(browserLang);
    } else {
      const best = findBestMatch(browserLang);
      languageSelect.value = best;
      chrome.storage.sync.set({ targetLang: best });
    }
    enableToggle.checked = result.isEnabled !== false;
  });

  // ── 4. Save on change ──
  languageSelect.addEventListener("change", () => {
    chrome.storage.sync.set({ targetLang: languageSelect.value }, () => {
      statusDiv.textContent = "Saved!";
      setTimeout(() => (statusDiv.textContent = ""), 1500);
    });
  });

  enableToggle.addEventListener("change", () => {
    chrome.storage.sync.set({ isEnabled: enableToggle.checked }, () => {
      statusDiv.textContent = "Saved!";
      setTimeout(() => (statusDiv.textContent = ""), 1500);
    });
  });
});
