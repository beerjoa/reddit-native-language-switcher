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
# In 2026, Firefox MV3 also supports service_worker. 
# If any changes were needed for Firefox, we could handle them here.
# For now, we use the same structure.
zip -r "$OUT_DIR/$NAME-firefox-v$VERSION.zip" \
    manifest.json \
    background.js \
    content-scripts/ \
    popup/ \
    icons/ \
    README.md \
    LICENCE \
    -x "*.DS_Store*" -x "__MACOSX*"

echo "Firefox package created: $OUT_DIR/$NAME-firefox-v$VERSION.zip"

echo "Done!"
