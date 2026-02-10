document.addEventListener("DOMContentLoaded", () => {
  const enableToggle = document.getElementById("enableToggle");
  const languageSelect = document.getElementById("language");
  const statusDiv = document.getElementById("status");

  // Load saved setting
  chrome.storage.sync.get(["targetLang", "isEnabled"], (result) => {
    if (result.targetLang) {
      languageSelect.value = result.targetLang;
    } else {
      languageSelect.value = "ko";
    }

    // Default to true if undefined
    enableToggle.checked = result.isEnabled !== false;
  });

  // Save setting on change
  languageSelect.addEventListener("change", () => {
    const targetLang = languageSelect.value;
    chrome.storage.sync.set({ targetLang: targetLang }, showStatus);
  });

  enableToggle.addEventListener("change", () => {
    const isEnabled = enableToggle.checked;
    chrome.storage.sync.set({ isEnabled: isEnabled }, showStatus);
  });

  function showStatus() {
    statusDiv.textContent = "Saved!";
    setTimeout(() => {
      statusDiv.textContent = "";
    }, 1500);
  }
});
