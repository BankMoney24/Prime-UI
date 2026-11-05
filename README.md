# PRIME — Unified PIM, RIM & TIM UI

Responsive interactive frontend for PRIME Inventory Suite. Built around the selected PRIME sidebar reference and the desktop/mobile product dashboards. PIM and TIM keep their existing detailed workflow engines and their domain-specific module pages; RIM remains available.

## Run

Extract this folder and run:

```bash
python3 -m http.server 8000
```

Open `http://localhost:8000/#/pim/dashboard`. You can switch PIM/RIM/TIM via product tabs in the header or the workspace switcher.

## Design changes

- **Sidebar**: light-blue active pill, hover states, expanded and icon-only collapsed modes, thick blue scroll indicator, tooltips, organisation/product context.
- **Top navigation**: PIM, RIM and TIM edition tabs, search with a Scan button, Chat, notifications, account dropdown with Add Account demo and Profile.
- **Dashboard**: product promotion carousel, subscription summary, four quick actions, inventory snapshot, filtered attention list, product status, wallet demo, low stock/requests, expandable activity/controls and analytical summaries.
- **Mobile**: top product selector, search/scan, responsive KPI tiles and record cards, product tiles, dedicated five-item bottom navigation.
- **PIM**: full material-request, catalogue, inventory, purchasing, allocation, stock-count, transfer, replenishment, supplier and asset workflows, with browser-local validation.
- **TIM**: 11 sector configurations (aviation, maritime, steel, oil/gas, construction, manufacturing, utilities, mining, rail, ports and aerospace), tools and equipment, toolboxes, issue/return, inspections, calibration, industrial exceptions and workpack controls. New tool registration starts in quarantine, pending inspection.
- **RIM**: original retail pages and workflows preserved.

## Technical architecture

- `app.js`, `data.js`, `styles.css`: shared application, routes and generic retail/settings UI.
- `pim.js`, `pim.css`: PIM operations with available/reserved/quarantined stock and validated transactions.
- `tim.js`, `tim.css`: TIM base pages.
- `tim-industrial-core.js`, `tim-industrial-ui.js`, `tim-industrial.css`: industry profiles, tool control, check-out, certification, workpack closeout, lifting equipment.
- `prime-refresh.js`, `prime-refresh.css`: visual redesign, product-aware responsive dashboard and navigation.
- `assets/prime-mark.svg`, `assets/js/qrcode.js`: PRIME brand and demo QR rendering.
- `tests/`: automated JavaScript/domain tests.

## QA

```bash
for f in app.js data.js pim.js tim.js tim-industrial-core.js tim-industrial-ui.js prime-refresh.js; do node --check "$f"; done
for t in tests/*.mjs; do node "$t"; done
```

Browser-based checks in this preparation environment: dashboard at 360, 390, 768 and 1440px without horizontal overflow or runtime errors, quick-action forms, PIM/TIM routes (55 accessible destinations), tool registration and quarantine restriction, inspection form, product switching, collapse/expand sidebar. The industrial domain flows and 12 existing test suites were preserved and passed.

## Deploy to your GitHub Pages repository

On a Mac with **write access** to `BankMoney24/Prime-UI`:

```bash
cd ~/Downloads/PRIME-2026-Modern-UI
bash deploy-to-github.sh
```

The script clones latest `main`, updates only the listed source/test/docs files and pushes without force. It does not change remote history and preserves unrelated files. If Pages is enabled on `main` / root, the public URL is typically `https://bankmoney24.github.io/Prime-UI/`. Confirm deployment in GitHub Settings → Pages.

## Scope and safety

**This is an interactive browser-local demonstration, not the operational PHP backend.** No real authorisations, audit signatures, financial transactions or industrial equipment certifications are issued. Active demo subscriptions, balances and records are illustrations. Tool-control release decisions require real authentication, approved industry procedures, protected service-side eligibility and regulatory review. Actual live equipment must never rely on browser-local simulation.
