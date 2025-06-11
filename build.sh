#!/bin/bash

# Production build script for Sakanfar Portfolio

echo "🚀 Building Sakanfar Productions Portfolio..."

# Clean previous build
echo "🧹 Cleaning previous build..."
rm -rf dist

# Build the project
echo "📦 Building project..."
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build completed successfully!"
    echo "📁 Files are ready in the 'dist' directory"
    echo ""
    echo "🌐 To preview the build:"
    echo "   npm run preview"
    echo ""
    echo "🚀 Ready for deployment to:"
    echo "   - Netlify (drag & drop 'dist' folder)"
    echo "   - Vercel (connect GitHub repo)"
    echo "   - AWS S3 (upload 'dist' contents)"
    echo "   - GitHub Pages (use GitHub Actions)"
else
    echo "❌ Build failed. Please check the errors above."
    exit 1
fi
