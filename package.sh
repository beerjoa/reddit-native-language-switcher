#!/bin/bash

# Configuration
NAME="reddit-native-language-switcher"
VERSION=$(grep '"version":' manifest.json | cut -d'"' -f4)
OUT_DIR="dist"

echo "Packaging $NAME v$VERSION..."

# Create dist directory if it doesn't exist
mkdir -p "$OUT_DIR"

# Clean previous builds
rm -f "$OUT_DIR/$NAME-chrome-v$VERSION.zip"
rm -f "$OUT_DIR/$NAME-firefox-v$VERSION.zip"

# Build Chrome ZIP
# Chrome uses service_worker: background.js which is already in manifest.json
zip -r "$OUT_DIR/$NAME-chrome-v$VERSION.zip" \
    manifest.json \
    background.js \
    content-scripts/ \
    popup/ \
    icons/ \
    README.md \
    LICENCE \
    -x "*.DS_Store*" -x "__MACOSX*"

echo "Chrome package created: $OUT_DIR/$NAME-chrome-v$VERSION.zip"

# Build Firefox ZIP
# Firefox MV3 requires background.scripts instead of background.service_worker
echo "Generating Firefox-compatible manifest..."

# Create a temporary directory for the Firefox build
TMP_DIR=$(mktemp -d)
cp -r background.js content-scripts popup icons README.md LICENCE "$TMP_DIR/"

# Transform manifest.json for Firefox using Node.js
node -e "
  const fs = require('fs');
  const manifest = JSON.parse(fs.readFileSync('manifest.json', 'utf8'));
  if (manifest.background && manifest.background.service_worker) {
    manifest.background.scripts = [manifest.background.service_worker];
    delete manifest.background.service_worker;
  }
  fs.writeFileSync('$TMP_DIR/manifest.json', JSON.stringify(manifest, null, 2));
"

# Create Firefox zip from the tmp directory
ORIG_DIR=$(pwd)
cd "$TMP_DIR" || exit 1
zip -r "$ORIG_DIR/$OUT_DIR/$NAME-firefox-v$VERSION.zip" \
    manifest.json \
    background.js \
    content-scripts/ \
    popup/ \
    icons/ \
    README.md \
    LICENCE \
    -x "*.DS_Store*" -x "__MACOSX*"
cd "$ORIG_DIR" || exit 1

# Clean up temporary directory
rm -rf "$TMP_DIR"

echo "Firefox package created: $OUT_DIR/$NAME-firefox-v$VERSION.zip"

echo "Done!"
