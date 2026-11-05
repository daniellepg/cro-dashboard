#!/bin/zsh
# Commit ONLY the funnel data file and push it so Vercel redeploys.
# Refuses to push if other commits are waiting to go out, so this job never
# publishes someone else's unfinished work.
set -e
cd "$(dirname "$0")/../.."
FILE=src/data/shopify-funnels/daily.json

git fetch -q origin main
if [ -n "$(git log origin/main..HEAD --oneline)" ]; then
  echo "FAIL: local main has unpushed commits that aren't from this job:"; git log origin/main..HEAD --oneline; exit 1
fi
if git diff --quiet -- "$FILE"; then echo "NOCHANGE: data file unchanged"; exit 0; fi
# Bring in anything new from GitHub first (keeps other people's uncommitted edits where they are).
git stash push -q -- "$FILE"
git merge -q --ff-only origin/main
git stash pop -q
git commit -q -m "Shopify funnel data refresh $(date +%Y-%m-%d)" -- "$FILE"
git push -q origin HEAD:main
echo "OK: pushed $(git log -1 --oneline)"
