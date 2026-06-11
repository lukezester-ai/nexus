#!/usr/bin/env bash
set -e

if [ -z "$GITHUB_PERSONAL_ACCESS_TOKEN" ]; then
  echo "ERROR: GITHUB_PERSONAL_ACCESS_TOKEN is not set"
  exit 1
fi

REMOTE_URL="https://${GITHUB_PERSONAL_ACCESS_TOKEN}@github.com/lukezester-ai/nexus.git"

git remote remove github 2>/dev/null || true
git remote add github "$REMOTE_URL"

echo "Pushing to GitHub..."
git push github main

echo ""
echo "✅ Push successful!"
