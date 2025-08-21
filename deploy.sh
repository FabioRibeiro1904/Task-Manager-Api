#!/bin/bash

# Deploy script for TaskNexus
echo "🚀 Deploying TaskNexus to Cloudflare..."

# Deploy Frontend to Cloudflare Pages
echo "📱 Deploying Frontend..."
cd task-manager-frontend
npm install
npm run build

# Deploy using Wrangler (Cloudflare CLI)
npx wrangler pages deploy build --project-name=tasknexus-frontend

echo "✅ Frontend deployed to Cloudflare Pages!"

# Instructions for API deployment
echo ""
echo "🔧 To deploy the API:"
echo "1. Push your code to GitHub"
echo "2. Connect to Railway.app or Render.com"
echo "3. Set environment variables:"
echo "   - ASPNETCORE_ENVIRONMENT=Production"
echo "   - Jwt__Key=your-secret-key"
echo "   - Jwt__Issuer=TaskManagerAPI"
echo "   - Jwt__Audience=TaskManagerClients"
echo ""
echo "🌐 Your frontend will be available at: https://tasknexus-frontend.pages.dev"
