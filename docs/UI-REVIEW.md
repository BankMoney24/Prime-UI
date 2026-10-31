# PRIME frontend overhaul — coverage and QA

## Scope and source

The overhaul targets the public `BankMoney24/Prime-UI` static prototype, not the PHP production server. The source used was the current GitHub frontend, previously uploaded PRIME PHP project structure and the user's dashboard and sidebar requirements. The separate PDF wireframes were excluded.

## UX principles applied

- Clear product context with one PRIME account and PIM/RIM/TIM product switching.
- A short primary sidebar. All remaining operations in All modules, with no deep cascading flyouts.
- Quick actions directly under the compact dashboard greeting.
- No bar charts in dashboard activity. Four summary values with Today / This week / This month / Annually.
- Secondary dashboard sections below Explore more, each collapsed on initial display.
- One component library for navigation, badges, controls, tables, drawers and modals.
- Page-level actions, data headings and sample records tailored to the current module.
- Responsive record cards and navigation at mobile widths.
- Explicit sample data and local-draft labels rather than implying server-side operations.
- Help not duplicated in the top header. Chat and notifications remain.
- Requests is a direct sidebar destination. Create New is not in the sidebar. Bookings is secondary.

## UI modules

PIM includes requests, catalogue, stock, purchasing, assets, projects, suppliers, maintenance, stock counts, locations, budgets, custody checks, warranties, people, imports, reports, replenishment, field app, transfers, contracts, kits, bookings and bills.

RIM includes POS, sales, returns, products, inventory, customers, fulfilment, pricing, stores, store operations, sales channels, merchandising, loyalty, payments, purchasing, suppliers, retail assets and reports.

TIM includes tool register, tool store, issue/return, inspections, calibration, maintenance, custody, work orders, spare parts, procurement, suppliers, compliance, personnel, sites, service providers, stock transfers and reports.

Shared views include Tasks, Approvals, Documents, Notifications, Chat, Activity, Team, Policies, Billing, Audit, Settings, Profile, Help, Team feedback, Version notes, Onboarding and a sign-in design preview.

## QA performed

- JavaScript syntax validation through Node.
- Data schema and navigation consistency checks.
- DOM string rendering checks of all PIM/RIM/TIM module screens, and eight simulated interaction scenarios.
- Header, sidebar, quick action, POS, modal and accordion checks.
- CSS syntax parsing and responsive media query checks.
- Deployment script tested against a local temporary Git remote, preserving commit history and supporting a repeat run.

**Browser limitation:** this container's managed Chromium denies automated navigation. An authenticated real-browser session, visual comparison and backend workflow QA still need to be completed before treating the redesign as production ready. No claim of fully tested production functionality is made.

## Future integration

For real collaboration, connect an authenticated shared feedback database. For real inventory, wire pages into existing PRIME PHP APIs, preserving role-based access, approval rules and transaction integrity. GitHub Pages alone cannot execute PHP or perform server-side updates.
