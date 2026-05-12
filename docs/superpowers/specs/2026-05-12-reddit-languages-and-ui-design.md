# Design Spec: Language Expansion & UI Redesign

**Date:** 2026-05-12
**Status:** Approved — Awaiting implementation plan
**Project:** Native Language Switcher for Reddit (browser extension)

---

## 1. Motivation

The extension currently supports only 6 languages in its popup dropdown (ko, en, es, ja, fr, de), while Reddit's native post translation (`tl=` URL parameter) supports over 24 languages. The UI is a bare-bones popup with generic CSS. This spec covers:

1. **Expanding supported languages** to match Reddit's `tl=` parameter coverage
2. **Redesigning the popup UI** per DESIGN.md (Claude/Anthropic design system)
3. **Smart default language** based on browser locale on first install
4. **Legal disclaimer** in the popup footer
5. **Updating related documentation**

---

## 2. Language Research Summary

Reddit's native post translation (`?tl=xx` URL parameter) was introduced in early 2024 and expanded through 2025. Based on cross-referencing competitor extensions (Chrome Web Store), StackExchange usage evidence, and official RedditInc blog posts:

### Confirmed supported language codes (25 total)

| Code | Native Name | English Name | Source Confidence |
|---|---|---|---|
| `ko` | 한국어 | Korean | Existing |
| `en` | English | English | Existing |
| `ja` | 日本語 | Japanese | Existing |
| `zh-Hans` | 简体中文 | Chinese (Simplified) | Competitor ext |
| `zh-Hant` | 繁體中文 | Chinese (Traditional) | StackExchange confirmed `zh-hant` works |
| `es` | Español | Spanish | Existing + competitor |
| `pt` | Português | Portuguese | README + competitor |
| `fr` | Français | French | Existing + competitor |
| `de` | Deutsch | German | Existing + competitor |
| `it` | Italiano | Italian | README + competitor |
| `nl` | Nederlands | Dutch | README + competitor |
| `sv` | Svenska | Swedish | README + competitor |
| `da` | Dansk | Danish | Competitor ext |
| `no` | Norsk | Norwegian | Competitor ext |
| `fi` | Suomi | Finnish | Competitor ext |
| `ru` | Русский | Russian | Competitor ext |
| `el` | Ελληνικά | Greek | Competitor ext |
| `tr` | Türkçe | Turkish | Competitor ext |
| `hu` | Magyar | Hungarian | Competitor ext |
| `ro` | Română | Romanian | Competitor ext |
| `th` | ไทย | Thai | Competitor ext |
| `vi` | Tiếng Việt | Vietnamese | Competitor ext |
| `hi` | हिन्दी | Hindi | Competitor ext + RedditInc blog |
| `fil` | Filipino | Filipino | Competitor ext |
| `ms` | Bahasa Melayu | Malay | Competitor ext |

**Note on confidence:** Reddit's help center and API docs are access-restricted from automated fetching. The list above draws from independent third-party extensions that claim "26 languages officially supported by Reddit." We include 25 (accounting for their "never translate" mode as the 26th slot). If any code proves non-functional at runtime, the content script's existing fail-safe logic (HTTP status check) gracefully falls back to the original post without error.

---

## 3. Architecture: Approach 2 — Data-Driven

### Rationale

Approach 2 separates language data (`languages.js`) from rendering logic (`popup.js`). This avoids hardcoding 25 `<option>` elements in HTML and makes future language additions a one-line data change.

### File Changes

| File | Action | Description |
|---|---|---|
| `languages.js` | **NEW** | Language data array: `SUPPORTED_LANGUAGES` with `code`, `nativeName`, `englishName` |
| `popup/popup.html` | MODIFY | Remove hardcoded `<option>`s; add `<header>`, `<footer>` with disclaimer; load `languages.js` |
| `popup/popup.css` | **REWRITE** | Full DESIGN.md token mapping (CSS custom properties) |
| `popup/popup.js` | MODIFY | Dynamic `<select>` population; browser language detection; best-match fallback |
| `background.js` | MODIFY | Default language on install from `navigator.language` instead of hardcoded `"ko"` |
| `content-scripts/content.js` | NO CHANGE | Already uses `tl=${state.targetLang}` — any valid code works |
| `manifest.json` | NO CHANGE | No new permissions or content script changes needed |
| `README.md` | MODIFY | Update supported language list; add legal disclaimer |
| `PRIVACY_POLICY.md` | MODIFY | Document browser language detection |

### Data Flow

```
┌─────────────┐     ┌──────────────┐     ┌──────────────────┐
│ languages.js │────▶│  popup.js    │────▶│ chrome.storage   │
│ (data)       │     │ (renders      │     │ .sync           │
│              │     │  <select>,    │     │ {targetLang,    │
│              │     │  detects      │     │  isEnabled}     │
│              │     │  browser lang)│     └────────┬─────────┘
└─────────────┘     └──────────────┘               │
                                                    ▼
                                           ┌──────────────────┐
                                           │  content.js      │
                                           │  (reads storage, │
                                           │   appends ?tl=   │
                                           │   to Reddit URLs)│
                                           └──────────────────┘
```

---

## 4. Component Design (DESIGN.md Alignment)

### Popup Layout (250px wide)

```
┌──────────────────────────────┐
│  Native Language Switcher    │  ← title (typography.button: 16px/500/ink)
│  for Reddit                  │  ← subtitle (12px/400/muted)
├──────────────────────────────┤
│  Enable Translation    [✓]   │  ← toggle-row (14px/500/ink)
├──────────────────────────────┤
│  Target Language             │  ← label (13px/500/muted)
│  ┌────────────────────────┐  │
│  │ 한국어 (Korean)       ▼│  │  ← select (text-input spec: 40px, md radius)
│  └────────────────────────┘  │
├──────────────────────────────┤
│  Saved!                      │  ← status (13px/500/primary)
├──────────────────────────────┤
│  This is an independent      │  ← footer (11px/400/muted-soft)
│  project and is not...       │     hairline top border
└──────────────────────────────┘
```

### DESIGN.md Token Mapping

| DESIGN.md Token | CSS Variable | Applied To |
|---|---|---|
| `{colors.canvas}` #faf9f5 | `--canvas` | Body background, select background |
| `{colors.ink}` #141413 | `--ink` | Title, labels, toggle text |
| `{colors.body}` #3d3d3a | `--body` | Default text color |
| `{colors.muted}` #6c6a64 | `--muted` | Subtitle, form labels |
| `{colors.muted-soft}` #8e8b82 | `--muted-soft` | Footer disclaimer text |
| `{colors.primary}` #cc785c | `--primary` | Status text, focus ring |
| `{colors.primary-active}` #a9583e | `--primary-active` | (reserved for future active states) |
| `{colors.hairline}` #e6dfd8 | `--hairline` | Borders, dividers |
| `{colors.surface-card}` #efe9de | `--surface-card` | (reserved) |
| `{colors.on-primary}` #ffffff | `--on-primary` | (reserved) |
| `{typography.button}` | — | Title: 16px/500, StyreneB/Inter |
| `{typography.body-sm}` | — | Select text: 14px/400 |
| `{typography.caption}` | — | Labels, status: 13px/500 |
| `{typography.nav-link}` | — | (adapted for toggle: 14px/500) |
| `{rounded.md}` 8px | `--radius-md` | Select border-radius |
| `{rounded.lg}` 12px | `--radius-lg` | (reserved) |
| `{component.text-input}` | — | Select: 40px height, 10px×14px padding |
| `{spacing.sm}` 12px | `--spacing-sm` | Container gap |
| `{spacing.md}` 16px | `--spacing-md` | Body padding |
| `{spacing.xs}` 8px | `--spacing-xs` | Footer padding, header margin |

**What we intentionally DON'T apply from DESIGN.md:**

- Serif display fonts (`Copernicus` / `Tiempos Headline`) — inappropriate for a tiny settings popup
- `{spacing.section}` 96px — physically impossible in 250px width
- `{spacing.xl}` 32px card padding — would consume entire popup width
- Component variants (`button-primary`, `callout-card-coral`) — popup has no buttons or cards; just a select + toggle
- Elevation/shadow system — popup is a single surface, no depth hierarchy needed
- Dark navy surfaces — popup stays on cream canvas throughout

### Typography Decision

We use **StyreneB / Inter (sans-serif)** exclusively — no serif display. Reasoning:
- The popup is 250×~200px with dense controls, not a reading surface
- Serif at 14-16px in a cramped settings panel reads as noise, not literary warmth
- The DESIGN.md itself uses sans for body, nav, buttons, captions — popup content is all body/nav/button-scale text
- This follows the DESIGN.md principle: "Don't use Inter for display headlines" — but we have no display headlines; everything is label/body scale

---

## 5. Browser Language Detection

### Implementation

```js
const browserLang = (navigator.language || "en").split("-")[0];  // "ko-KR" → "ko"
```

- **No permissions required:** `navigator.language` is available in all browser extension contexts
- **Privacy-safe:** Value never leaves the user's device; only stored in `chrome.storage.sync`
- **Fallback chain:** exact match → prefix match (`zh`→`zh-Hans`) → `ko` (ultimate fallback)

### When it runs

1. **On first install** (`chrome.runtime.onInstalled` in `background.js`): if no stored `targetLang`, set from browser locale
2. **On popup open** (`popup.js`): if no stored `targetLang`, select from browser locale and persist

Once user manually selects a language, that choice persists and overrides browser detection.

---

## 6. Legal Disclaimer

Added to popup footer:

> This is an independent project and is not affiliated with or endorsed by Anthropic or Reddit.

Also added to README in a visible location (below the feature list or in a dedicated disclaimer section).

**Rationale:** The DESIGN.md is Anthropic's proprietary brand system for claude.com. Using its color palette, typography scale, and component patterns could create brand confusion. The disclaimer makes the independent nature of the project explicit.

---

## 7. Testing Considerations

### Manual test cases

1. **Language appears in dropdown:** All 25 languages render with native name + English name
2. **Browser language detection:** Clear storage, reopen popup → language matches `navigator.language`
3. **Language persistence:** Select "Deutsch", close and reopen popup → "Deutsch" still selected
4. **Content script compatibility:** Set target language to any code (e.g., `th`, `zh-Hant`), visit a Reddit post → `?tl=th` appended if translation available
5. **Disclaimer visibility:** Popup footer always shows disclaimer text
6. **Toggle works:** Disable → `?tl=` removed from URL; re-enable → `?tl=` reapplied

### No automated tests

This is a browser extension with no test framework in place. Adding one is out of scope.

---

## 8. Related Documents to Update

| Document | Changes |
|---|---|
| `README.md` | - Language list: 6 → 25<br>- Add legal disclaimer section<br>- Update feature description to mention browser language detection |
| `PRIVACY_POLICY.md` | - Section 2: Document `navigator.language` usage (local only, no transmission)<br>- Update last-updated date |

---

## 9. Self-Review Notes

- **No placeholders:** All language codes, CSS values, and file paths are concrete.
- **Scope is single-spec:** All changes are in one extension codebase with no external dependencies or sub-projects.
- **No ambiguity:** Language code format (`zh-Hans` vs `zh-hans`), fallback behavior, and CSS token mapping are all explicit.
- **Chinese code format:** Uses `zh-Hans`/`zh-Hant` (BPC 47 style) — consistent with StackExchange evidence that `zh-hant` works as `tl=` value. When browser reports `zh`, we map to `zh-Hans` as default.
