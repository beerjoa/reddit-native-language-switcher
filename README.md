# Native Language Switcher for Reddit

Automatically switches to the official translated version of Reddit posts if available.

This extension detects when a Reddit post has a native translation available (e.g. ko, ja, es) and seamlessly redirects you to the translated version.
If the translation is invalid or missing, it keeps you on the original post.

## Features

- **Automatic Detection**: Checks for available translations before loading the page.
- **Fail-safe Logic**: If translation is unavailable or broken (301 redirect), it automatically reverts to the original post without loops.
- **Toggle Support**: Easily enable/disable the feature via the popup menu.
- **Instant Language Switching**: Changing the target language instantly updates the current page.

## Installation

### Installation via Chrome Web Store (Coming Soon)

1. Go to the [Chrome Web Store](https://chrome.google.com/webstore).
2. Search for "Native Language Switcher for Reddit".
3. Click "Add to Chrome".

### Manual Installation (Developer Mode)

1. Download or clone this repository.
2. Open Chrome and navigate to `chrome://extensions/`.
3. Enable "Developer mode" in the top right corner.
4. Click "Load unpacked" and select the extension directory.

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

[MIT](https://choosealicense.com/licenses/mit/)
