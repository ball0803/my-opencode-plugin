#!/bin/bash

# Create tools directory if it doesn't exist
mkdir -p ~/.config/opencode/tool

# Check if ast-grep is installed
if ! command -v ast-grep &> /dev/null; then
    echo "Installing ast-grep..."
    npm install -g ast-grep
fi

# Copy tool files
cp -r src/tools/ast-grep/*.ts ~/.config/opencode/tool/ || true

# Install dependencies if needed
if [ ! -f ~/.config/opencode/package.json ]; then
    echo "Creating package.json for custom tools..."
    cat > ~/.config/opencode/package.json << 'EOP'
{
  "name": "opencode-custom-tools",
  "version": "1.0.0",
  "dependencies": {
    "@opencode-ai/plugin": "latest"
  }
}
EOP
    npm install --prefix ~/.config/opencode
fi

echo "Custom tools installed successfully!"
echo "Restart OpenCode to use the new tools."
