# PRIME — PIM deep inventory frontend

PIM is now the first fully expanded edition of the PRIME team-review frontend. RIM and TIM remain available through the existing shared shell and keep their original interactions.

## Start and preview

```bash
cd PRIME-PIM-Deep-Overhaul
python3 -m http.server 8000
```

Open `http://localhost:8000/#/pim/dashboard`.

PIM primary routes: Requests, Catalogue, Inventory, Purchasing, Assets and Projects. More modules are available in All modules, including Batches & traceability, Suppliers, Maintenance, Stock counts, Locations, Budgets, Custody checks, Warranties, People & accountability, Imports, Reports, Replenishment, Field app, Transfers, Contracts, Kits, Bookings and Bills.

### Working example flows

1. **Requests:** create a draft → submit → approve → allocate available stock → issue → return usable or damaged materials.
2. **Purchasing:** create a purchase draft → submit → approve → send to supplier → receive part or all of the outstanding quantity.
3. **Inventory:** inspect location-specific stock, reserved and quarantined quantities, and movement history.
4. **Transfers:** create a draft, dispatch from the origin, then confirm receipt into the destination.
5. **Stock counts:** enter a blind physical count → review variance → confirm adjustment.
6. **Catalogue:** register a new SKU, unit, category, tracking and barcode.
7. **Replenishment:** review lead-time thresholds, then create a purchase request draft.
8. **Reports:** inspect movement, valuation and purchase records and download CSV.

**All demonstration changes remain in the visitor's browser.** No live inventory, accounts, payments, approvals or supplier orders are created. Clearing site storage resets them.

## Run tests

```bash
node --check app.js
node --check data.js
node --check pim.js
node tests/qa.mjs
node tests/interactions.mjs
node tests/pim.mjs
node tests/pim-integration.mjs
node tests/pim-workflows.mjs
```

## Publish to GitHub Pages

On a Mac signed in to GitHub with write access to `BankMoney24/Prime-UI`:

```bash
cd ~/Downloads/PRIME-PIM-Deep-Overhaul
bash deploy-to-github.sh
```

The script clones the latest `main`, copies the website, creates a commit only if files changed, and pushes without `--force`. If GitHub rejects the push, sign into an account with repository write permission. The ChatGPT connector currently has read-only access.

Enable Pages once under repository **Settings → Pages → Deploy from a branch → main → /(root)**. The expected URL is `https://bankmoney24.github.io/Prime-UI/`; confirm it in Pages settings.

## Source map

- `index.html` — app entry.
- `app.js`, `data.js`, `styles.css` — original shared shell and RIM/TIM frontend.
- `pim.js` — dedicated PIM inventory workflow model, page renderers, transitions and validation.
- `pim.css` — PIM page, table, dashboard, mobile and form design styles.
- `assets/prime-mark.svg` — logo.
- `tests/` — shared and PIM QA tests.
- `docs/PIM-INVENTORY-RESEARCH.md` — external research and implementation mapping.
- `docs/PIM-QA-REPORT.md` — QA scope, verified tests and browser-testing limitations.

This is not a substitute for the real PRIME PHP backend. Do not deploy browser-local demonstration logic as a production source of truth.


## Packaging correction

This fixed package includes `assets/prime-mark.svg`. The deployment script
also preserves the existing GitHub logo if the local logo is missing, so a
packaging omission cannot stop an otherwise valid deployment.

From this folder, run `bash deploy-to-github.sh`. The script clones the current
`main`, runs all Node QA checks, and pushes only if files changed. It never
force-pushes and needs GitHub write permission.

## Dashboard and notifications refinement — 2 November 2026

The PIM Dashboard now follows the team's compact mobile reference:

- Four outlined, icon-matched Quick Actions: **Request stock**, **Request purchase**, **Receive stock**, **Add item**. Actions open the existing PIM forms.
- Each actionable request row has **View** beside its details. It opens that specific record, not a generic module.
- **View all** appears on Needs your attention, Low stock, My requests and Analytics, and on the expanded secondary cards. Low stock opens its dedicated replenishment tab. My requests opens its own filtered tab.
- **Analytics** shows live calculated demonstration values, with **Today**, **This week**, **This month** and **Annually** options. No decorative bar charts.
- **Recent stock movements**, **Workspace setup**, **Inventory settings**, and **Stock health** are collapsed by default. A chevron expands each panel with proper `aria-expanded` state.
- **Notifications** have product filters, All/Unread/Read tabs, grouped items, concise summaries, record navigation, unread badges and Mark all as read. The count in the header reflects the same read state.
- Fixed a pre-existing recursive rendering issue when opening a PIM record detail.

All business actions remain browser-local demonstration flows. The source of truth for the production PHP ERP is unchanged.

### Quality checks

```bash
node --check app.js
node --check data.js
node --check pim.js
for test in tests/*.mjs; do node "$test"; done
```

A separate browser-based smoke test of the assembled frontend passed 30 interaction and viewport checks across 1440, 768, 390 and 360 px.

### Safe publish

```bash
bash deploy-to-github.sh
```

The deployment script clones the current `main`, runs tests and pushes a new commit without force-pushing. It requires write access to `BankMoney24/Prime-UI`.
