#!/bin/bash

# Serene iOS Deploy Script
# Builds and installs the app on a connected iPhone

set -e

DEVICE_ID="00008120-001C0C3A2293C01E"
DEVICE_NAME="I love you"
APP_NAME="Serene"
WORKSPACE="ios/Serene.xcworkspace"
DERIVED_DATA="$HOME/Library/Developer/Xcode/DerivedData"

echo "=========================================="
echo "  Serene iOS Deploy"
echo "=========================================="
echo ""

# Check if ios folder exists
if [ ! -d "ios" ]; then
    echo "📁 iOS folder not found, running prebuild..."
    npx expo prebuild --platform ios
fi

# Parse arguments
CLEAN=false
for arg in "$@"; do
    case $arg in
        --clean)
            CLEAN=true
            ;;
    esac
done

# Clean build if requested
if [ "$CLEAN" = true ]; then
    echo "🧹 Clean build requested..."
    rm -rf ios/
    npx expo prebuild --platform ios
fi

echo "🔨 Building $APP_NAME for device: $DEVICE_NAME..."
echo ""

# Build the app
xcodebuild -workspace "$WORKSPACE" \
    -configuration Release \
    -scheme "$APP_NAME" \
    -destination "id=$DEVICE_ID" \
    -allowProvisioningUpdates \
    -quiet

echo ""
echo "✅ Build completed!"
echo ""

# Find the built app
APP_PATH=$(find "$DERIVED_DATA" -path "*$APP_NAME*" -name "$APP_NAME.app" -type d 2>/dev/null | grep "Release-iphoneos" | head -1)

if [ -z "$APP_PATH" ]; then
    echo "❌ Error: Could not find built app"
    exit 1
fi

echo "📱 Installing on $DEVICE_NAME..."
xcrun devicectl device install app --device "$DEVICE_ID" "$APP_PATH"

echo ""
echo "=========================================="
echo "  ✅ Serene installed successfully!"
echo "=========================================="
echo ""
echo "Open the app on your iPhone."
