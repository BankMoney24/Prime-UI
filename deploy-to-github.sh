#!/usr/bin/env bash
# PRIME safe GitHub Pages deployment: never force-pushes or resets history.
set -Eeuo pipefail
REPO_URL="${PRIME_REPO:-https://github.com/BankMoney24/Prime-UI.git}"
BRANCH="${PRIME_BRANCH:-main}"
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TEMP_DIR="$(mktemp -d "${TMPDIR:-/tmp}/prime-deploy.XXXXXXXX")"
trap 'rm -rf "$TEMP_DIR"' EXIT
printf '\nPRIME UI — Deploy to GitHub\n'
printf 'Repository: %s\nBranch: %s\n' "$REPO_URL" "$BRANCH"
if ! command -v git >/dev/null 2>&1; then echo 'Git is required.' >&2; exit 2; fi
for path in index.html app.js data.js styles.css assets/prime-mark.svg README.md; do
  if [ ! -f "$ROOT/$path" ]; then echo "Missing file: $path" >&2; exit 3; fi
done
if command -v node >/dev/null 2>&1; then
  echo 'Checking JavaScript and UI schema...'
  (cd "$ROOT" && node --check app.js && node --check data.js && node tests/qa.mjs && node tests/interactions.mjs)
fi
echo 'Cloning the latest remote branch (existing history is preserved)...'
if ! git clone --quiet --branch "$BRANCH" "$REPO_URL" "$TEMP_DIR/repo"; then
  echo 'Clone failed. Check your repository URL, internet connection and GitHub access.' >&2
  exit 4
fi
for path in index.html app.js data.js styles.css README.md .nojekyll .gitignore; do
  [ ! -f "$ROOT/$path" ] || cp "$ROOT/$path" "$TEMP_DIR/repo/$path"
done
mkdir -p "$TEMP_DIR/repo/assets" "$TEMP_DIR/repo/tests" "$TEMP_DIR/repo/docs"
cp "$ROOT/assets/prime-mark.svg" "$TEMP_DIR/repo/assets/prime-mark.svg"
cp "$ROOT/tests/qa.mjs" "$TEMP_DIR/repo/tests/qa.mjs"
cp "$ROOT/tests/interactions.mjs" "$TEMP_DIR/repo/tests/interactions.mjs"
cp "$ROOT/docs/UI-REVIEW.md" "$TEMP_DIR/repo/docs/UI-REVIEW.md"
cp "$ROOT/docs/REVIEW-GUIDE.md" "$TEMP_DIR/repo/docs/REVIEW-GUIDE.md"
cp "$ROOT/deploy-to-github.sh" "$TEMP_DIR/repo/deploy-to-github.sh"
cd "$TEMP_DIR/repo"
git add index.html app.js data.js styles.css assets/prime-mark.svg README.md .nojekyll .gitignore tests/qa.mjs tests/interactions.mjs docs/UI-REVIEW.md docs/REVIEW-GUIDE.md deploy-to-github.sh
if git diff --cached --quiet; then
  echo 'No changes detected. The current branch already contains this version.'
  exit 0
fi
if ! git -c user.name="${PRIME_COMMIT_NAME:-PRIME UI}" -c user.email="${PRIME_COMMIT_EMAIL:-prime-ui@users.noreply.github.com}" commit -m "feat(ui): comprehensive PRIME team review interface" --quiet; then
  echo 'Could not create the local commit.' >&2;exit 5
fi
printf '\nPushing safely to %s...\n' "$BRANCH"
if ! git push origin "$BRANCH"; then
  echo '' >&2
  echo 'PUSH FAILED: GitHub denied access or the branch changed.' >&2
  echo 'Sign in with a GitHub account that can write to BankMoney24/Prime-UI.' >&2
  echo 'No force push was attempted and the remote history was not overwritten.' >&2
  exit 6
fi
printf '\nPushed successfully.\n'
printf 'Repository: https://github.com/BankMoney24/Prime-UI\n'
printf 'Pages: https://bankmoney24.github.io/Prime-UI/ (if Pages is enabled)\n'
