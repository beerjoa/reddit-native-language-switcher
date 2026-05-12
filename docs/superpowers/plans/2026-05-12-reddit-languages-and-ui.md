# Language Expansion & UI Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Expand Reddit Native Language Switcher from 6 to 25 languages, redesign popup UI using DESIGN.md tokens, add browser language auto-detection on install, and include legal disclaimer.

**Architecture:** Data-driven — language list extracted to `languages.js` data file. `popup.js` dynamically renders `<select>` options from this data. `popup.css` rewrites to use DESIGN.md CSS custom properties (cream canvas, coral primary, warm ink text, sans-serif typography). `background.js` uses `navigator.language` for first-install default instead of hardcoded `"ko"`. Content script unchanged — already generic on `state.targetLang`.

**Tech Stack:** Vanilla JS (no frameworks), Manifest V3 browser extension API, Chrome Storage Sync API, CSS custom properties.

---

### Task 1: Create language data file

**Files:**
- Create: `languages.js`
- Modify: `package.sh:19-27` (Chrome zip line), `package.sh:52-61` (Firefox zip line)

- [ ] **Step 1: Create `languages.js` at project root**

```js
// Reddit Native Translation — Supported Languages
// Data file referenced by popup/popup.js for dynamic dropdown rendering.
// Add new languages here; popup.js reads SUPPORTED_LANGUAGES at runtime.
const SUPPORTED_LANGUAGES = [
  { code: "ko",      nativeName: "한국어",          englishName: "Korean" },
  { code: "en",      nativeName: "English",           englishName: "English" },
  { code: "ja",      nativeName: "日本語",             englishName: "Japanese" },
  { code: "zh-Hans", nativeName: "简体中文",          englishName: "Chinese (Simplified)" },
  { code: "zh-Hant", nativeName: "繁體中文",          englishName: "Chinese (Traditional)" },
  { code: "es",      nativeName: "Español",            englishName: "Spanish" },
  { code: "pt",      nativeName: "Português",          englishName: "Portuguese" },
  { code: "fr",      nativeName: "Français",           englishName: "French" },
  { code: "de",      nativeName: "Deutsch",            englishName: "German" },
  { code: "it",      nativeName: "Italiano",           englishName: "Italian" },
  { code: "nl",      nativeName: "Nederlands",         englishName: "Dutch" },
  { code: "sv",      nativeName: "Svenska",            englishName: "Swedish" },
  { code: "da",      nativeName: "Dansk",              englishName: "Danish" },
  { code: "no",      nativeName: "Norsk",              englishName: "Norwegian" },
  { code: "fi",      nativeName: "Suomi",              englishName: "Finnish" },
  { code: "ru",      nativeName: "Русский",            englishName: "Russian" },
  { code: "el",      nativeName: "Ελληνικά",           englishName: "Greek" },
  { code: "tr",      nativeName: "Türkçe",             englishName: "Turkish" },
  { code: "hu",      nativeName: "Magyar",             englishName: "Hungarian" },
  { code: "ro",      nativeName: "Română",             englishName: "Romanian" },
  { code: "th",      nativeName: "ไทย",                englishName: "Thai" },
  { code: "vi",      nativeName: "Tiếng Việt",         englishName: "Vietnamese" },
  { code: "hi",      nativeName: "हिन्दी",             englishName: "Hindi" },
  { code: "fil",     nativeName: "Filipino",            englishName: "Filipino" },
  { code: "ms",      nativeName: "Bahasa Melayu",       englishName: "Malay" },
];
```

Write to: `/Users/Jay/.local/share/opencode/worktree/56f887f83f90a25a408525bb3793b160dabaf797/opencode-refactoring/languages.js`

- [ ] **Step 2: Verify the file exists and is valid JS**

Run: `node -c languages.js`
Expected: no output (syntax OK)

- [ ] **Step 3: Add `languages.js` to `package.sh`**

In `package.sh`, add `languages.js` on a new line after `background.js` in both the Chrome ZIP block (lines 19-27) and the Firefox ZIP block (lines 52-61).

Chrome block (line 19-27), change:
```
    background.js \
```
to:
```
    background.js \
    languages.js \
```

Firefox block (line 52-61), change:
```
    background.js \
```
to:
```
    background.js \
    languages.js \
```

Also add `languages.js` to the `cp` line in the Firefox block (line 37). Change:
```
cp -r background.js content-scripts popup icons README.md LICENCE "$TMP_DIR/"
```
to:
```
cp -r background.js languages.js content-scripts popup icons README.md LICENCE "$TMP_DIR/"
```

- [ ] **Step 4: Verify package script includes the new file**

Run: `grep "languages.js" package.sh`
Expected: 3 matching lines (Chrome zip, Firefox cp, Firefox zip)

---

### Task 2: Rewrite popup CSS with DESIGN.md tokens

**Files:**
- Rewrite: `popup/popup.css`

- [ ] **Step 1: Replace `popup/popup.css` with DESIGN.md-aligned styles**

Write to: `/Users/Jay/.local/share/opencode/worktree/56f887f83f90a25a408525bb3793b160dabaf797/opencode-refactoring/popup/popup.css`

```css
/* ── DESIGN.md Token Mapping: colors, typography, spacing, radius ── */
:root {
  --canvas: #faf9f5;            /* {colors.canvas} */
  --ink: #141413;               /* {colors.ink} */
  --body: #3d3d3a;              /* {colors.body} */
  --muted: #6c6a64;             /* {colors.muted} */
  --muted-soft: #8e8b82;        /* {colors.muted-soft} */
  --primary: #cc785c;           /* {colors.primary} */
  --hairline: #e6dfd8;          /* {colors.hairline} */
  --radius-md: 8px;             /* {rounded.md} */
  --spacing-xs: 8px;            /* {spacing.xs} */
  --spacing-sm: 12px;           /* {spacing.sm} */
  --spacing-md: 16px;           /* {spacing.md} */
}

/* ── Base ── */
body {
  width: 250px;
  padding: var(--spacing-md);
  font-family: "StyreneB", "Inter", -apple-system, BlinkMacSystemFont,
    "Segoe UI", Roboto, sans-serif;
  background-color: var(--canvas);
  color: var(--body);
  margin: 0;
}

/* ── Container ── */
.container {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

/* ── Header ── */
.title {
  margin: 0;
  font-size: 16px;
  font-weight: 500;
  color: var(--ink);
}

.subtitle {
  margin: 2px 0 0 0;
  font-size: 12px;
  font-weight: 400;
  color: var(--muted);
}

/* ── Toggle Row ── */
.toggle-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  font-weight: 500;
  color: var(--ink);
  cursor: pointer;
}

/* ── Form Group ── */
.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-label {
  font-size: 13px;
  font-weight: 500;
  color: var(--muted);
}

/* ── Select (matches {component.text-input}) ── */
select {
  padding: 10px 14px;
  border-radius: var(--radius-md);
  border: 1px solid var(--hairline);
  background-color: var(--canvas);
  color: var(--ink);
  font-family: inherit;
  font-size: 14px;
  font-weight: 400;
  line-height: 1.55;
  height: 40px;
  appearance: none;
  cursor: pointer;
}

select:focus {
  outline: none;
  border-color: var(--primary);
}

/* ── Status ── */
.status {
  font-size: 13px;
  font-weight: 500;
  color: var(--primary);
  min-height: 16px;
}

/* ── Footer ── */
.footer {
  border-top: 1px solid var(--hairline);
  padding-top: var(--spacing-xs);
}

.footer p {
  margin: 0;
  font-size: 11px;
  font-weight: 400;
  color: var(--muted-soft);
  line-height: 1.4;
}
```

- [ ] **Step 2: Verify CSS syntax**

Run: `node -e "const fs = require('fs'); const css = fs.readFileSync('popup/popup.css','utf8'); console.log('CSS file read OK, lines:', css.split('\\n').length);"`
Expected: `CSS file read OK, lines: <number>`

---

### Task 3: Update popup HTML

**Files:**
- Modify: `popup/popup.html`

- [ ] **Step 1: Replace `popup/popup.html` with new structure**

Write to: `/Users/Jay/.local/share/opencode/worktree/56f887f83f90a25a408525bb3793b160dabaf797/opencode-refactoring/popup/popup.html`

```html
<!doctype html>
<html>
  <head>
    <meta charset="UTF-8" />
    <link rel="stylesheet" href="popup.css" />
  </head>
  <body>
    <div class="container">
      <h2 class="title">Native Language Switcher</h2>
      <p class="subtitle">for Reddit</p>

      <div class="form-group">
        <label class="toggle-row" for="enableToggle">
          <span>Enable Translation</span>
          <input type="checkbox" id="enableToggle" />
        </label>
      </div>

      <div class="form-group">
        <label class="form-label" for="language">Target Language</label>
        <select id="language"></select>
      </div>

      <div id="status" class="status"></div>

      <footer class="footer">
        <p>
          This is an independent project and is not affiliated
          with or endorsed by Anthropic or Reddit.
        </p>
      </footer>
    </div>
    <script src="../languages.js"></script>
    <script src="popup.js"></script>
  </body>
</html>
```

- [ ] **Step 2: Verify HTML is well-formed**

Run: `xmllint --html popup/popup.html --noout 2>&1 || true`
Expected: HTML parsed (warnings about HTML5 ok; the `--noout` flag means no output on success)

---

### Task 4: Update popup JS with dynamic rendering + browser language detection

**Files:**
- Modify: `popup/popup.js`

- [ ] **Step 1: Replace `popup/popup.js`**

Write to: `/Users/Jay/.local/share/opencode/worktree/56f887f83f90a25a408525bb3793b160dabaf797/opencode-refactoring/popup/popup.js`

```js
document.addEventListener("DOMContentLoaded", () => {
  const enableToggle = document.getElementById("enableToggle");
  const languageSelect = document.getElementById("language");
  const statusDiv = document.getElementById("status");

  // ── 1. Populate language dropdown from SUPPORTED_LANGUAGES (languages.js) ──
  SUPPORTED_LANGUAGES.forEach(({ code, nativeName, englishName }) => {
    const option = document.createElement("option");
    option.value = code;
    option.textContent = `${nativeName} (${englishName})`;
    languageSelect.appendChild(option);
  });

  // ── 2. Browser language detection ──
  function getBrowserLang() {
    const lang = (navigator.language || "en").split("-")[0];
    const localeMap = { zh: "zh-Hans" };
    return localeMap[lang] || lang;
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
    return "ko";
  }

  // ── 3. Load saved settings ──
  chrome.storage.sync.get(["targetLang", "isEnabled"], (result) => {
    if (result.targetLang) {
      const matched = SUPPORTED_LANGUAGES.find(
        (l) => l.code === result.targetLang
      );
      languageSelect.value = matched
        ? matched.code
        : findBestMatch(getBrowserLang());
    } else {
      const best = findBestMatch(getBrowserLang());
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
```

- [ ] **Step 2: Verify JS syntax**

Run: `node -c popup/popup.js`
Expected: no output (syntax OK)

---

### Task 5: Update background.js with browser language default

**Files:**
- Modify: `background.js`

- [ ] **Step 1: Replace `background.js`**

Write to: `/Users/Jay/.local/share/opencode/worktree/56f887f83f90a25a408525bb3793b160dabaf797/opencode-refactoring/background.js`

```js
// Background Service Worker

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.get(["targetLang"], (result) => {
    if (!result.targetLang) {
      const lang = (navigator.language || "en").split("-")[0];
      const localeMap = { zh: "zh-Hans" };
      const best = localeMap[lang] || lang;
      chrome.storage.sync.set({ targetLang: best });
      console.log("Default language set to", best, "(from browser:", navigator.language, ")");
    }
  });
});
```

- [ ] **Step 2: Verify JS syntax**

Run: `node -c background.js`
Expected: no output (syntax OK)

---

### Task 6: Update README.md

**Files:**
- Modify: `README.md`

- [ ] **Step 1: Update supported languages in README**

In `README.md`, find the line:
```
This extension detects when a Reddit post has a native translation available (e.g., `ko`, `ja`, `es`, `pt`, `fr`, `de`, `it`, `nl`, `sv`) and seamlessly redirects you to the translated version.
```

Replace with:
```
This extension detects when a Reddit post has a native translation available across 25 languages (e.g., `ko`, `ja`, `zh-Hant`, `es`, `pt`, `fr`, `de`, `it`, `nl`, `sv`, `ru`, `th`, `vi`, `hi`, and more) and seamlessly redirects you to the translated version.
```

- [ ] **Step 2: Add Smart Default feature to feature list**

After the "Instant Switching" line, add:
```
- **Smart Language Detection**: On first install, automatically detects your browser's language and sets it as the default translation target.
```

- [ ] **Step 3: Add legal disclaimer section**

After the "## 🤝 Contributing" section, add a new section:

```markdown
## ⚠️ Disclaimer

This is an independent project and is not affiliated with or endorsed by Anthropic or Reddit.
```

- [ ] **Step 4: Verify README changes**

Run: `grep -c "25 languages" README.md && grep -c "Smart Language Detection" README.md && grep -c "not affiliated" README.md`
Expected:
```
1
1
1
```

---

### Task 7: Update PRIVACY_POLICY.md

**Files:**
- Modify: `PRIVACY_POLICY.md`

- [ ] **Step 1: Update last-updated date**

Change line 3:
```
**Last Updated: February 11, 2026**
```
To:
```
**Last Updated: May 12, 2026**
```

- [ ] **Step 2: Document browser language detection in Section 2**

After the existing bullet about "Verification Requests" (line 14), add a new bullet:

```markdown
- **Browser Language Detection**: On first install, the extension reads `navigator.language` (a read-only property provided by your browser) to pre-select your default target language. This value is used only locally and is never transmitted to any server.
```

- [ ] **Step 3: Verify the update**

Run: `grep "navigator.language" PRIVACY_POLICY.md`
Expected: 1 matching line

---

### Task 8: Final verification — extension loads without errors

**Files:**
- Verify all changed files

- [ ] **Step 1: Check all modified files exist and are valid**

Run:
```bash
echo "=== File existence ===" && \
ls -la languages.js popup/popup.html popup/popup.css popup/popup.js background.js README.md PRIVACY_POLICY.md && \
echo "=== JS syntax ===" && \
node -c languages.js && echo "languages.js OK" && \
node -c popup/popup.js && echo "popup.js OK" && \
node -c background.js && echo "background.js OK" && \
echo "=== Content script unchanged ===" && \
node -c content-scripts/content.js && echo "content.js OK (unchanged)" && \
echo "=== package.sh includes languages.js ===" && \
grep -c "languages.js" package.sh
```

Expected: All files listed, all JS syntax checks pass, `grep` returns `3`

- [ ] **Step 2: Verify manifest.json references are valid**

Run:
```bash
node -e "
const m = require('./manifest.json');
console.log('background:', m.background?.service_worker);
console.log('content_scripts:', m.content_scripts?.[0]?.js?.join(', '));
console.log('default_popup:', m.action?.default_popup);
"
```

Expected:
```
background: background.js
content_scripts: content.js
default_popup: popup/popup.html
```
(manifest unchanged — just confirming references still resolve to existing files)

- [ ] **Step 3: Validate the package script works**

Run: `bash package.sh`
Expected: "Done!" with no errors, two ZIP files created in `dist/`

- [ ] **Step 4: Verify languages.js is inside the generated ZIPs**

Run:
```bash
unzip -l dist/reddit-native-language-switcher-chrome-*.zip | grep languages.js
unzip -l dist/reddit-native-language-switcher-firefox-*.zip | grep languages.js
```

Expected: `languages.js` listed in both ZIP contents
