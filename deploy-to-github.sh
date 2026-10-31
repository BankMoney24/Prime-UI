#!/usr/bin/env bash
# PRIME: safe GitHub Pages update. Keeps existing main history and unrelated repository files.
set -Eeuo pipefail
REPO_URL="${PRIME_REPO:-https://github.com/BankMoney24/Prime-UI.git}"
BRANCH="${PRIME_BRANCH:-main}"
SOURCE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TEMP="$(mktemp -d "${TMPDIR:-/tmp}/prime-pim-XXXXXXXX")"
trap 'rm -rf "$TEMP"' EXIT
for required in index.html app.js data.js styles.css pim.js pim.css assets/prime-mark.svg README.md; do
  if [[ ! -f "$SOURCE/$required" ]]; then echo "Missing required file: $required" >&2;exit 2;fi
done
command -v git >/dev/null || { echo 'Git must be installed.' >&2;exit 2; }
if command -v node >/dev/null; then
  echo 'Running syntax and PIM integration checks...'
  (cd "$SOURCE" && node --check app.js && node --check data.js && node --check pim.js && node tests/qa.mjs && node tests/interactions.mjs && node tests/pim.mjs && node tests/pim-integration.mjs && node tests/pim-workflows.mjs)
fi
echo "Cloning current $BRANCH from $REPO_URL"
if ! git clone --quiet --branch "$BRANCH" "$REPO_URL" "$TEMP/repo"; then
  echo 'Clone failed. Check repository URL and credentials.' >&2;exit 3
fi
mkdir -p "$TEMP/repo/assets" "$TEMP/repo/tests" "$TEMP/repo/docs"
files=(index.html app.js data.js styles.css pim.js pim.css README.md .nojekyll .gitignore
       assets/prime-mark.svg tests/qa.mjs tests/interactions.mjs tests/pim.mjs tests/pim-integration.mjs tests/pim-workflows.mjs
       docs/UI-REVIEW.md docs/REVIEW-GUIDE.md docs/PIM-INVENTORY-RESEARCH.md docs/PIM-QA-REPORT.md deploy-to-github.sh)
for rel in "${files[@]}"; do
  if [[ -f "$SOURCE/$rel" ]]; then cp "$SOURCE/$rel" "$TEMP/repo/$rel";fi
done
cd "$TEMP/repo"
git add -- "${files[@]}"
if git diff --cached --quiet; then
  echo 'No changes to push. The target branch already contains these files.';exit 0
fi
git -c user.name="${PRIME_COMMIT_NAME:-PRIME UI}" -c user.email="${PRIME_COMMIT_EMAIL:-prime-ui@users.noreply.github.com}" commit -m 'feat(pim): inventory workflow overhaul and page-level UX' --quiet
if ! git push origin "$BRANCH"; then
  echo 'Push denied or branch changed. Use a GitHub account with write access, then rerun this script.' >&2
  echo 'No force push or remote history reset was used.' >&2;exit 4
fi
echo 'PRIME PIM frontend pushed.'
echo 'Repository: https://github.com/BankMoney24/Prime-UI'
echo 'Pages (if enabled): https://bankmoney24.github.io/Prime-UI/'
