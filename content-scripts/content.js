// Reddit Translate Content Script

let targetLang = "ko"; // Default

// 1. Initialize language from storage
chrome.storage.sync.get(["targetLang"], (result) => {
  if (result.targetLang) {
    targetLang = result.targetLang;
  }
});

// 2. Listen for changes in storage
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === "sync" && changes.targetLang) {
    targetLang = changes.targetLang.newValue;
    console.log("[Reddit Translate] Language updated to:", targetLang);
  }
});

// 3. Event Delegation for Link Clicks
document.addEventListener(
  "click",
  (e) => {
    // Find the closest anchor tag
    const anchor = e.target.closest("a");

    console.log("[DEBUG] Clicked element:", e.target);
    console.log("[DEBUG] Closest anchor:", anchor);

    // If no anchor or no href, ignore
    if (!anchor || !anchor.href) return;

    try {
      const url = new URL(anchor.href);

      // Only target reddit.com
      if (!url.hostname.includes("reddit.com")) return;

      // Check if it's a valid navigation link (not javascript: output or hash only)
      if (url.protocol !== "http:" && url.protocol !== "https:") return;

      // Check if 'tl' param already exists
      if (url.searchParams.has("tl")) return;

      // AVOID INFINITE LOOPS: Check if we are already on the target URL (rare for clicks, but safe)
      // Actually, if we are clicking a link, we want to go there.

      // Prevent default navigation
      e.preventDefault();
      e.stopPropagation();

      // Append 'tl' parameter
      url.searchParams.set("tl", targetLang);

      console.log(
        "[Reddit Translate] Intercepting navigation to:",
        url.toString(),
      );

      // Force navigation
      console.log(
        "[Reddit Translate] Navigating via assign to:",
        url.toString(),
      );
      window.location.assign(url.toString());
    } catch (err) {
      console.error("[Reddit Translate] Error parsing URL:", err);
    }
  },
  true,
); // Use capture phase to ensure we catch it early
