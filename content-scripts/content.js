// Reddit Translate Content Script

(() => {
  // --- Configuration ---
  const CONFIG = {
    DEFAULT_LANG: "ko",
    RATE_LIMIT_DURATION: 10000, // 10 seconds
    FOUC_TIMEOUT: 2500, // Safety timeout for hiding page
    CHECK_INTERVAL: 1000, // SPA URL checking interval
  };

  // --- Runtime State ---
  const state = {
    targetLang: CONFIG.DEFAULT_LANG,
    isEnabled: true,
    lastUrl: location.href,
  };

  // --- Utilities: Rate Limiter ---
  const RateLimiter = {
    getKey(url) {
      return `rt_check_${url}`;
    },

    isLimited(url) {
      try {
        const key = this.getKey(url);
        const timestamp = sessionStorage.getItem(key);
        if (timestamp) {
          const timeDiff = Date.now() - parseInt(timestamp, 10);
          if (timeDiff < CONFIG.RATE_LIMIT_DURATION) {
            console.log(
              `[Reddit Translate] Rate limited: ${url} (${timeDiff}ms ago)`,
            );
            return true;
          }
        }
        return false;
      } catch (e) {
        return false;
      }
    },

    setLimit(url) {
      try {
        const key = this.getKey(url);
        sessionStorage.setItem(key, Date.now().toString());
      } catch (e) {
        console.error("SessionStorage error", e);
      }
    },
  };

  // --- Utilities: Reddit URL Helper ---
  const RedditUtils = {
    isValidPostPath(ur) {
      try {
        const urlObj = new URL(ur);
        return (
          urlObj.hostname.includes("reddit.com") &&
          urlObj.pathname.match(/\/r\/[^/]+\/comments\//)
        );
      } catch (e) {
        return false;
      }
    },

    isUntranslatedPost(ur) {
      try {
        const urlObj = new URL(ur);
        return this.isValidPostPath(ur) && !urlObj.searchParams.has("tl");
      } catch (e) {
        return false;
      }
    },
  };

  // --- Core Controller ---
  const PageController = {
    hideContent() {
      document.documentElement.style.visibility = "hidden";
      // Safety timeout
      setTimeout(() => {
        this.showContent();
      }, CONFIG.FOUC_TIMEOUT);
    },

    showContent() {
      document.documentElement.style.visibility = "";
    },

    setCursorWait(wait) {
      if (document.body) {
        document.body.style.cursor = wait ? "wait" : "";
      }
    },

    async checkAndRedirect(url, isInitialLoad = false) {
      // 1. Guard Clauses
      if (!state.isEnabled) {
        if (isInitialLoad) this.showContent();
        return;
      }

      if (!RedditUtils.isUntranslatedPost(url)) {
        if (isInitialLoad) this.showContent();
        return;
      }

      if (RateLimiter.isLimited(url)) {
        if (isInitialLoad) this.showContent();
        return;
      }

      // 2. Visual Feedback
      if (!isInitialLoad) this.setCursorWait(true);

      const translatedUrl = new URL(url);
      translatedUrl.searchParams.set("tl", state.targetLang);

      console.log(
        `[Reddit Translate] Checking availability: ${translatedUrl.toString()}`,
      );

      try {
        const response = await fetch(translatedUrl.toString(), {
          method: "GET",
          redirect: "manual",
        });

        console.log(`[Reddit Translate] Status: ${response.status}`);

        if (response.status === 200) {
          console.log(`[Reddit Translate] Translation found. Redirecting...`);
          RateLimiter.setLimit(url);

          if (location.href === url) {
            location.replace(translatedUrl.toString());
          } else {
            location.assign(translatedUrl.toString());
          }
        } else {
          console.log(
            `[Reddit Translate] No translation (Status: ${response.status}). Staying on original.`,
          );
          if (isInitialLoad) {
            this.showContent();
          } else if (location.href !== url) {
            location.assign(url);
          }
        }
      } catch (error) {
        console.error("[Reddit Translate] Error checking translation:", error);
        if (isInitialLoad) {
          this.showContent();
        } else if (location.href !== url) {
          location.assign(url);
        }
      } finally {
        if (!isInitialLoad) this.setCursorWait(false);
      }
    },

    handleStateChange(changes) {
      if (changes.targetLang) {
        state.targetLang = changes.targetLang.newValue;
        console.log(
          "[Reddit Translate] Language updated to:",
          state.targetLang,
        );
      }
      if (changes.isEnabled) {
        state.isEnabled = changes.isEnabled.newValue;
        console.log(
          "[Reddit Translate] Enabled state updated to:",
          state.isEnabled,
        );
      }

      const currentUrl = new URL(location.href);

      // Check URL validity
      if (!RedditUtils.isValidPostPath(location.href)) return;

      // Handle Disabled State
      if (!state.isEnabled) {
        this.showContent();
        if (currentUrl.searchParams.has("tl")) {
          currentUrl.searchParams.delete("tl");
          console.log("[Reddit Translate] disabled. Removing translation...");
          location.assign(currentUrl.toString());
        }
        return;
      }

      // Handle Enabled State
      if (currentUrl.searchParams.has("tl")) {
        const currentTl = currentUrl.searchParams.get("tl");
        if (currentTl !== state.targetLang) {
          currentUrl.searchParams.set("tl", state.targetLang);
          console.log(
            "[Reddit Translate] Language changed. Updating translation...",
          );
          location.assign(currentUrl.toString());
        }
      } else {
        // Not translated -> Try to translate
        this.checkAndRedirect(location.href, false);
      }
    },
  };

  // --- Initialization Logic ---

  // 1. Immediate Execution (Document Start)
  if (RedditUtils.isUntranslatedPost(location.href)) {
    if (!RateLimiter.isLimited(location.href)) {
      PageController.hideContent();
    }
  }

  // 2. Load Settings & Start
  chrome.storage.sync.get(["targetLang", "isEnabled"], (result) => {
    // Determine default state first (handled by state initialization), override if stored
    if (result.targetLang) state.targetLang = result.targetLang;

    // Explicitly check for boolean (since default is true)
    if (result.isEnabled !== undefined) {
      state.isEnabled = result.isEnabled;
    }

    if (!state.isEnabled) {
      PageController.showContent();
      return;
    }

    PageController.checkAndRedirect(location.href, true);
  });

  // 3. Listeners
  chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace === "sync") {
      PageController.handleStateChange(changes);
    }
  });

  // 4. Navigation Handling
  async function handleNavigation(url, event) {
    if (!state.isEnabled) return;
    if (RedditUtils.isUntranslatedPost(url)) {
      event.preventDefault();
      event.stopPropagation();
      await PageController.checkAndRedirect(url, false);
    }
  }

  // SPA Observer
  setInterval(() => {
    if (location.href !== state.lastUrl) {
      state.lastUrl = location.href;
      console.log("[Reddit Translate] URL changed:", state.lastUrl);
      PageController.checkAndRedirect(state.lastUrl, false);
    }
  }, CONFIG.CHECK_INTERVAL);

  // Click Interception
  document.addEventListener(
    "click",
    (e) => {
      const anchor = e.target.closest("a");
      if (!anchor || !anchor.href) return;
      if (e.button !== 0 || e.ctrlKey || e.shiftKey || e.altKey || e.metaKey)
        return;

      try {
        const url = new URL(anchor.href);
        if (!url.hostname.includes("reddit.com")) return;
        handleNavigation(anchor.href, e);
      } catch (err) {
        // Ignore invalid URLs
      }
    },
    true,
  );
})();
