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
- `prime-dialog-ux.js`, `prime-dialog-ux.css`: shared accessible modal, detail drawer, responsive forms and focused error presentation.
- `assets/prime-mark.svg`, `assets/js/qrcode.js`: PRIME brand and demo QR rendering.
- `tests/`: automated JavaScript/domain tests.

## QA

```bash
for f in app.js data.js pim.js tim.js tim-industrial-core.js tim-industrial-ui.js prime-refresh.js prime-dialog-ux.js; do node --check "$f"; done
for t in tests/*.mjs; do node "$t"; done
```

Browser-based checks in this preparation environment: dashboard at 360, 390, 768 and 1440px without horizontal overflow or runtime errors, quick-action forms, PIM/TIM routes (54 accessible destinations), tool registration and quarantine restriction, inspection form, product switching, collapse/expand sidebar. The industrial domain flows and 12 existing test suites were preserved and passed.

## Deploy to your GitHub Pages repository

On a Mac with **write access** to `BankMoney24/Prime-UI`:

```bash
cd ~/Downloads/PRIME-PIM-TIM-UX-Overhaul
bash deploy-to-github.sh
```

The script clones latest `main`, updates only the listed source/test/docs files and pushes without force. It does not change remote history and preserves unrelated files. If Pages is enabled on `main` / root, the public URL is typically `https://bankmoney24.github.io/Prime-UI/`. Confirm deployment in GitHub Settings → Pages.

## Scope and safety

**This is an interactive browser-local demonstration, not the operational PHP backend.** No real authorisations, audit signatures, financial transactions or industrial equipment certifications are issued. Active demo subscriptions, balances and records are illustrations. Tool-control release decisions require real authentication, approved industry procedures, protected service-side eligibility and regulatory review. Actual live equipment must never rely on browser-local simulation.

## PIM / TIM page and modal QA (5 November 2026)

This revision compares the current PRIME UI with the earlier supplied **PrimeInventory Tool Control Demo**. The reference uses clear dialogs for decisions and forms, and right-hand drawers for details. PRIME now applies that interaction pattern to PIM and TIM while retaining their existing domain validation.

- PIM: inline required indicators, compact step instructions, scrollable forms with always-available action buttons, focused validation errors and improved record drawers.
- TIM: tool issue blockers surfaced in a dedicated tool drawer, domain-specific action labels, two-column desktop form grids, explicit tool/recipient selection and better read-only record details.
- Page fixes: TIM site filtering is now respected in applicable lists; empty search results provide a filter reset; redundant table-level “View all” links were removed; reference-only records no longer pretend to have a tool label.
- Shared keyboard handling: focus is contained in active dialogs, Escape closes through the existing controller, backgrounds stop scrolling and controls stay accessible on mobile.
- Test coverage: existing domain suites plus `tests/modal-contract.mjs`, comprehensive PIM and TIM route checks, modal behaviour and 360/390/768/1440px width QA. See `docs/PIM-TIM-UX-QA-2026-11-05.md`.

This is an **interactive review frontend**. Demonstration signatures, permissions, audit events and equipment safety decisions are not production-grade backend controls.

## Preview and source package

- For a local website: `python3 -m http.server 8000` then open `http://localhost:8000/#/pim/dashboard`.
- For a single-file offline preview: `python3 build-preview.py` and open `PRIME-PIM-TIM-Offline-Preview.html`.
- The original source remains full, editable HTML/CSS/JavaScript and does not rely on screenshot assets for the interface.

Updated 5 November 2026.

## PIM, RIM and TIM polish — November 2026
- App Walkthrough is permanently visible after Documents in the sidebar for every product and opens a five-step interactive centred modal.
- Record details for PIM and TIM now open as centred modal windows at desktop and mobile widths, retaining original domain actions and validations.
- The shared RIM record pages have a concise product-specific summary and refined reusable table, filter, status and action styling. POS stays linked to its current demonstration logic.
- Wallet balance includes a contrasting white Top up wallet button. Its amount form is a **preview only**; no payments, actual balance updates or external transactions occur.
- The added `prime-polish.css` file centralises visual treatments across all three editions.
