# PRIME — PIM and TIM Frontend Update

A team-review frontend for **PRIME** with Product Inventory Management (PIM), Retail Inventory Management (RIM), and Tool Inventory Management (TIM).

This is a public interactive demonstration. All figures, employee names, approvals, stock figures, tool records, plan details and transactions are sample data. The browser-local workflow engines are **not** the production inventory ledger.

## What changed

### PIM dashboard

- **Needs your attention:** Request status sits in the right-hand action column, above **View**, matching the Low Stock and My Requests rows. Item name, request reference, quantity and requester stay together on the left.
- **Analytics period:** Today, Weekly, Monthly, Annually.
- **Billing:** Added a compact PIM plan and billing card, linking to the existing Billing & plans view.
- Preserved quick actions, low-stock View all, request View all, stock summaries and collapsible panels.

### TIM tool management

- New TIM dashboard with quick actions, tool availability, urgency summaries, overdue returns, analytics, compact plan information and expandable sections.
- Domain-specific pages for **Tools & equipment**, **Tool store**, **Issue & return**, **Custody & assignments**, **Inspections**, **Calibration**, **Maintenance** and **Work orders**. Other TIM modules continue to use the existing PRIME shared page components.
- Tool issue requires a custodian and return date. A tool with an expired calibration, failed inspection, quarantine or existing open issue cannot be issued.
- Returns record condition. Damage quarantines a tool, and expired calibration/failed inspection prevents normal re-release.
- Inspections record pass/fail outcomes. A failed inspection requires a reason.
- Calibration records can release a tool once the tool has passed inspection and has a valid certificate.
- Work orders capture the tool, technician and work description.
- Desktop tables become record cards on phones. List filtering, status tabs, details and local demo forms are interactive.

## Preview locally

From the extracted `PRIME-PIM-TIM-Updated` folder:

```bash
python3 -m http.server 8000
```

Open `http://localhost:8000/#/pim/dashboard`, then switch to TIM through the product menu.

You can also open the accompanying standalone HTML preview without running a server.

## Run QA

Requires Node.js.

```bash
node --check app.js
node --check pim.js
node --check tim.js
for file in tests/*.mjs; do node "$file"; done
```

Automated tests cover the existing shell, PIM processes and TIM operational rules. Browser-based screenshot and screen-reader testing are still needed before accepting the UI as fully reviewed.

## Push to GitHub

The deployment script clones the latest main branch, copies the public website files, runs syntax and unit checks, commits changes and pushes without `--force`. It preserves unrelated repository files.

```bash
bash deploy-to-github.sh
```

Repository: https://github.com/BankMoney24/Prime-UI

Expected GitHub Pages address (when enabled): https://bankmoney24.github.io/Prime-UI/

Use a GitHub account authorised to push to `BankMoney24/Prime-UI`. The connected ChatGPT GitHub account has read-only access and did not publish this update.

## Important boundaries

- No production API/database integration, real authentication, payments, true role-based access control or multi-user data synchronisation.
- PIM and TIM demo state is stored separately in each visitor's browser.
- RIM remains available and unchanged, apart from the necessary shared-shell TIM integration.
- Backend acceptance tests and permission checks must be carried out when connecting the workflows to the existing PHP application.
