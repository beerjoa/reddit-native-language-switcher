document.addEventListener("DOMContentLoaded", () => {
  const languageSelect = document.getElementById("language");
  const statusDiv = document.getElementById("status");

  // Load saved setting
  chrome.storage.sync.get(["targetLang"], (result) => {
    if (result.targetLang) {
      languageSelect.value = result.targetLang;
    } else {
      // Default to 'ko' if not set
      languageSelect.value = "ko";
    }
  });

  // Save setting on change
  languageSelect.addEventListener("change", () => {
    const targetLang = languageSelect.value;
    chrome.storage.sync.set({ targetLang: targetLang }, () => {
      // Visual feedback
      statusDiv.textContent = "Saved!";
      setTimeout(() => {
        statusDiv.textContent = "";
      }, 1500);
    });
  });
});
