# PRIME — Product, Retail and Tool Inventory Management

Interactive front-end demonstration for the three PRIME products:

- **PIM** — Product Inventory Management: material requests, approvals, procurement, inventory, assets, projects, custody checks and reports.
- **RIM** — Retail Inventory Management: POS, orders, returns, pricing, store stock, customers and fulfilment.
- **TIM** — Tool Inventory Management: equipment, crib management, check-outs, inspections, calibration, maintenance, custody and compliance.

## Run immediately

No installation or build command is required. Extract this ZIP and open `index.html` in your browser. Or start a local server from this folder:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000/`.

## Safely publish to the existing GitHub repository

This package targets [BankMoney24/Prime-UI](https://github.com/BankMoney24/Prime-UI). The repository already exists. **Do not use `git init`, `git remote add origin`, or `git push --force` on this ZIP.**

**macOS / Linux** (run inside the extracted `Prime-UI` folder):

```bash
bash push-to-github.sh
```

**Windows PowerShell** (run inside the extracted folder):

```powershell
powershell -ExecutionPolicy Bypass -File .\push-to-github.ps1
```

The scripts clone the existing `main` branch first, copy the updated files on top, commit only changed files, fetch the latest upstream changes, and push without rewriting remote history. Re-running a successful script with unchanged files reports `Already up to date`.

These scripts cannot bypass GitHub authentication or repository permissions. Your local Git credentials need write access to `BankMoney24/Prime-UI`. If prompted to log in, authenticate as `BankMoney24` or a collaborator with write access. A `403` or `Permission denied` requires fixing account/permissions, not repeating the push.

To configure a missing Git commit identity:

```bash
git config --global user.name "Your Git Name"
git config --global user.email "your-email@example.com"
```

The provided files contain no `.git` directory, so they cannot produce an unrelated-history conflict.

## GitHub Pages

Open repository Settings → Pages → Build and deployment, select **Deploy from a branch**, branch `main`, folder `/ (root)`, and Save. The published URL usually follows `https://bankmoney24.github.io/Prime-UI/`, but use the URL GitHub displays after deployment.

## Key interactions

- Edition switcher, grouped sidebar navigation, collapsed navigation and mobile drawer.
- Dashboard with quick actions, chart-free key activity cards and five time ranges.
- Chat and Notifications in the header, profile dropdown, settings and account preview.
- Explore More, subscription overview and support navigation.
- Product, procurement, inventory, retail POS and tool register demonstration flows.
- Search, status filters, record details, CSV export, sample forms and browser-local feedback.

## What is not included

This is a **static UI prototype** with fictional sample data. It does not include a production database, authentication, payment processing, or shared feedback across browsers. Changes created while testing are browser-local. No real supplier orders, payments, inventory balances or messages are submitted.

## Source files

- `index.html` — static website entry point
- `styles.css` — complete responsive UI design
- `app.js` — navigation, all edition data, screens and interactions
- `assets/prime-mark.svg` — brand mark
- `tests/verify.mjs` — source checks (`node tests/verify.mjs`)
- `push-to-github.sh` / `push-to-github.ps1` — safe deployment scripts
- `.nojekyll` — GitHub Pages asset compatibility


## Restored original full dashboard

The Home dashboard restores the October 25 reference layout below the chart-free Key activity cards:

- My to-do: approval, receiving, supplier and overdue-task queues.
- Stock health (PIM), store stock health (RIM) or tool readiness (TIM).
- Recent activity with navigable event entries.
- My material requests / sales orders / tool requests with matching new-record actions.
- Get started readiness checklist and an interactive four-step quick tour.
- Explore More, plan usage, profile, Chat, notifications and Contact Support remain.

The original local ERP database is not included. Example content is fictional and all interactions are safe demonstrations.
