#!/bin/bash

# 🚀 Quick Start Guide for NCR Local Guide Bot
# Run this to get the app up and running in minutes!

echo "=========================================="
echo "🗺️  NCR Local Guide Bot - Quick Start"
echo "=========================================="
echo ""

# Check Node.js
echo "✓ Checking Node.js..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not installed. Please install Node.js v18+"
    exit 1
fi
echo "✅ Node.js $(node --version) found"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install --quiet
if [ $? -eq 0 ]; then
    echo "✅ Dependencies installed"
else
    echo "❌ Failed to install dependencies"
    exit 1
fi
echo ""

# Check project structure
echo "🔍 Verifying project structure..."
if [ ! -f ".kiro/product.md" ]; then
    echo "❌ .kiro/product.md not found"
    exit 1
fi
echo "✅ .kiro/product.md found"

if [ ! -f "src/server.js" ]; then
    echo "❌ src/server.js not found"
    exit 1
fi
echo "✅ src/server.js found"

if [ ! -f "public/index.html" ]; then
    echo "❌ public/index.html not found"
    exit 1
fi
echo "✅ public/index.html found"
echo ""

# Display test information
echo "=========================================="
echo "🎯 Test Commands"
echo "=========================================="
echo ""
echo "After the server starts, test with:"
echo ""
echo "1️⃣  Open browser:"
echo "   http://localhost:3001"
echo ""
echo "2️⃣  Test with cURL (in another terminal):"
echo "   curl -X POST http://localhost:3001/api/ask \\"
echo "     -H 'Content-Type: application/json' \\"
echo "     -d '{\"query\":\"Explain jugaad\"}'"
echo ""
echo "3️⃣  Example queries to try:"
echo "   • 'Explain jugaad'"
echo "   • 'Best momos kaha milenge?'"
echo "   • 'Traffic Ghaziabad to Noida?'"
echo "   • 'Scene kya hai?'"
echo ""
echo "=========================================="
echo ""
echo "🚀 Starting server..."
echo "Press Ctrl+C to stop"
echo ""

# Start the server
npm start
