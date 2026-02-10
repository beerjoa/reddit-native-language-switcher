document.addEventListener("DOMContentLoaded", () => {
  const actionBtn = document.getElementById("action-btn");
  const statusSpan = document.getElementById("status");
  const featureToggle = document.getElementById("feature-toggle");

  // Load saved settings
  chrome.storage.local.get(["featureEnabled"], (result) => {
    if (result.featureEnabled !== undefined) {
      featureToggle.checked = result.featureEnabled;
    }
  });

  actionBtn.addEventListener("click", () => {
    // Add micro-animation feedback
    actionBtn.textContent = "Triggered!";
    setTimeout(() => {
      actionBtn.textContent = "Trigger Action";
    }, 1500);

    // Send message to background script
    chrome.runtime.sendMessage({ action: "PING" }, (response) => {
      console.log("Response from background:", response);
      if (response && response.status === "PONG") {
        statusSpan.classList.add("active");
      }
    });
  });

  featureToggle.addEventListener("change", () => {
    const isEnabled = featureToggle.checked;
    chrome.storage.local.set({ featureEnabled: isEnabled }, () => {
      console.log("Feature state saved:", isEnabled);
    });
  });
});
