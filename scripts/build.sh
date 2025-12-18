#!/bin/bash

# Build script for RAW

set -e

echo "🔨 Building RAW..."

# Clean dist
rm -rf dist

# Build TypeScript
echo "📦 Compiling TypeScript..."
npm run build

# Build bundles
echo "📦 Creating bundles..."
npm run build:bundles

echo "✅ Build complete!"

