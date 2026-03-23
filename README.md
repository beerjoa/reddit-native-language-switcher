# Reddit Native Language Switcher

Automatically switches Reddit posts to your preferred native language if an official translation is available.

[![Chrome Web Store](https://img.shields.io/chrome-web-store/v/ldppbbjabggkjmbjdckahjmcecagimmc.svg)](https://chromewebstore.google.com/detail/ldppbbjabggkjmbjdckahjmcecagimmc?utm_source=item-share-cb)
[![Firefox Add-ons](https://img.shields.io/amo/v/reddit-native-lang-switcher.svg)](https://addons.mozilla.org/en-US/firefox/addon/reddit-native-lang-switcher/)

This extension detects when a Reddit post has a native translation available (e.g., `ko`, `ja`, `es`, `pt`, `fr`, `de`, `it`, `nl`, `sv`) and seamlessly redirects you to the translated version. If the translation is unavailable or invalid, it gracefully keeps you on the original post.

## ✨ Features

- **Automatic Detection**: Instantly checks for available translations when you open a Reddit post.
- **Smart Fail-safe Logic**: If a translation is missing or broken (e.g., causes a redirect loop), the extension automatically reverts to the original post.
- **Easy Toggle**: Quickly enable or disable the extension via the simple popup menu.
- **Instant Switching**: Changing your preferred target language in the popup instantly applies the new language to your current page.

## 🚀 Installation

### 📥 Install from Official Stores

The easiest way to install the extension is through your browser's official add-on store:

- [**Download for Chrome**](https://chromewebstore.google.com/detail/ldppbbjabggkjmbjdckahjmcecagimmc?utm_source=item-share-cb)
- [**Download for Firefox**](https://addons.mozilla.org/en-US/firefox/addon/reddit-native-lang-switcher/)

### 🛠 Manual Installation (Developer Mode)

If you prefer to install manually or want to contribute to the development:

#### Google Chrome / Edge / Brave

1. Download or clone this repository.
2. Open Chrome and navigate to `chrome://extensions/`.
3. Enable **Developer mode** in the top right corner.
4. Click **Load unpacked** and select the directory containing the extension files.

#### Mozilla Firefox

1. Download or clone this repository.
2. Open Firefox and navigate to `about:debugging#/runtime/this-firefox`.
3. Click **Load Temporary Add-on...**.
4. Select the `manifest.json` file inside the extension directory.

## 📦 Packaging for Release

To build the deployment ZIP files for both Chrome and Firefox, run the included build script:

```bash
bash package.sh
```

This will automatically handle the Manifest V3 and API differences between Chrome and Firefox, and place the fully packaged `.zip` files in the `dist/` directory.

## 🤝 Contributing

Pull requests are always welcome! For major changes, please open an issue first to discuss what you would like to change or improve.

## 📄 License

This project is licensed under the [MIT License](https://choosealicense.com/licenses/mit/).
