# PRIME — PIM, RIM and TIM Industrial Edition

Interactive, standalone frontend for PRIME. **PIM and RIM remain available.** The TIM industrial workspace extends the original aviation Tool Control demo to eleven configurable sectors.

## TIM industry profiles

Aviation MRO, maritime and shipbuilding, steel and fabrication, oil and gas, construction, manufacturing and automotive, energy and utilities, mining, rail, ports/logistics and aerospace manufacturing. Each profile has separate demo records, terminology, tools, sites, job references and policy hints.

## TIM interactive workflows

- Tools & equipment: unique serial, QR/RFID label, custody, condition, inspection, certification, calibration, service.
- Toolboxes & shadow boards: reconciliation of each expected tool before issue and return, blocking missing items. Toolbox templates are separate from physical assets.
- Requests, approvals, issue & return: named recipient, category authorisation, scan validation, two handover acknowledgements, return reconciliation.
- Custody transfers, inspections, surprise checks, calibration, maintenance and work orders.
- Sector-specific request validation: oil/gas, utilities and rail demo policies require a work permit or track possession reference before issue.
- Exceptions: missing/damaged tools, investigations, comments, disposition, and controlled reinspection.
- **New — workpack closeout:** checks outstanding issues, unresolved exceptions and readiness. Requires evidence, four sector-aware checklist items and two distinct reviewer confirmations. Does **not** grant any regulatory release-to-service.
- **New — lifting & critical gear:** SWL placeholders, certificate expiry, inspection status and blocked issue indications. SWL values are illustrative and **must not be used for lifting**.
- Offline mode queues requests locally; review is required before any eventual sync. The demo never sends records to a server.
- Sector switching, role-based demo controls, audit timeline, CSV export and manual scan.

### Run locally

```bash
cd PRIME-TIM-Industry-Control-v2
python3 -m http.server 8000
```

Open http://localhost:8000/#/tim/dashboard. Use product switcher to return to PIM or RIM. For the new pages open `#/tim/workpacks`, `#/tim/lifting`, or `#/tim/toolboxes`.

### Run QA

```bash
node --check tim-industrial-core.js
node --check tim-industrial-ui.js
for test in tests/*.mjs; do node "$test"; done
```

### Deploy safely to GitHub Pages

```bash
bash deploy-to-github.sh
```

The deployment script clones the live branch, preserves remote history, checks all source and test files, and publishes without force-pushing. It requires your Git credentials to have write access to BankMoney24/Prime-UI. URL (after successful push and Pages deployment): https://bankmoney24.github.io/Prime-UI/.

### Boundaries

This is an interactive UI demonstration, **not** the production PHP backend or a certified aviation, maritime, lifting or industrial safety system. Role switches, signatures, offline queues, audit hashes, dates and sample SWL numbers are simulated in localStorage. It does not issue aircraft Certificates of Release to Service or legal lifting examination certificates. Actual use requires server authentication, robust event history, protected sign-offs, approved procedures, local regulatory review, and physical evidence capture.

Read `docs/TIM-INDUSTRY-CONTROL.md` for source feature mapping, reference standards and test coverage. The original uploaded demo remains a reference; its source is not redistributed here.
