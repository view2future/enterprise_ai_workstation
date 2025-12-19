#!/bin/bash
# Script to start the frontend demo

echo "Starting Regional AI Industry Enterprise Data Management Platform Frontend Demo..."
echo "Make sure you have Node.js and npm installed."
echo ""

cd /Users/wangyu94/enterprise_ai_workstation/frontend_demo

# Install dependencies if not already installed
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
fi

echo "Starting development server..."
echo "The application will be available at http://localhost:3000"
echo ""

# Start the Vite development server
npm run dev