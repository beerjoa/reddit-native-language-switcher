# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2026-05-12

### Added

- Support for 25 languages — up from 6 — covering all Reddit-native `tl=` translation codes
- Smart Language Detection: on first install, defaults to the browser's locale instead of hardcoded Korean
- Legal disclaimer in popup footer and README (independent project, not affiliated with Anthropic or Reddit)
- CHANGELOG.md following Keep a Changelog format
- Design spec and implementation plan documents under `docs/superpowers/`

### Changed

- Popup UI redesigned using the Anthropic design system: cream canvas background, coral primary accent, warm ink typography, sans-serif at caption/body/button scale
- Language dropdown dynamically rendered from `languages.js` data file instead of hardcoded HTML options
- Packaging script updated to include `languages.js` in both Chrome and Firefox ZIP builds

### Fixed

- Chinese locale detection: `zh-TW`/`zh-HK` now correctly map to Traditional Chinese (`zh-Hant`), not Simplified (`zh-Hans`)

## [1.0.0] - 2026-02-11

### Added

- Initial release
- Auto-redirect Reddit posts to native translations via `?tl=` URL parameter
- Popup with enable/disable toggle and language selection dropdown (6 languages: ko, en, es, ja, fr, de)
- Configurable logging utility for debugging
- Firefox and Chrome Manifest V3 support
- Privacy policy document
