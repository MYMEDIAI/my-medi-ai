#!/bin/bash

echo "🖼️  Fixing image paths and directory structure..."

# Create public/images directory if it doesn't exist
mkdir -p public/images

# Check if the logo file exists and is actually a file (not a directory)
if [ -d "public/images/medi-ai-logo.png" ]; then
    echo "❌ Found directory instead of file at public/images/medi-ai-logo.png"
    echo "🗑️  Removing incorrect directory..."
    rm -rf public/images/medi-ai-logo.png
fi

# Create a placeholder logo if the real one doesn't exist
if [ ! -f "public/images/medi-ai-logo.png" ]; then
    echo "📝 Creating placeholder logo..."
    
    # Create SVG placeholder
    cat > public/images/medi-ai-logo.png << 'EOF'
<svg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
  <rect width="60" height="60" rx="12" fill="#8b5cf6"/>
  <rect x="10" y="10" width="40" height="40" rx="8" fill="#a855f7"/>
  <rect x="15" y="15" width="30" height="30" rx="6" fill="#c084fc"/>
  <text x="30" y="38" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="20" font-weight="bold">M</text>
</svg>
EOF
    
    echo "✅ Placeholder logo created"
else
    echo "✅ Logo file already exists"
fi

# Fix permissions
chmod 644 public/images/* 2>/dev/null || true

echo "🎉 Image paths fixed!"
