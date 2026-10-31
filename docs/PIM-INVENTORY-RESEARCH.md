# PIM — Inventory research and implementation decisions

Research date: 31 October 2026

## Scope

This review uses the **existing PRIME HTML/CSS/JavaScript implementation** from the latest team-review package, the current connected GitHub repository for orientation, and public inventory-platform documentation. The separately supplied PDF wireframes were **not** used.

The updated site is a browser-local **interactive frontend demonstration**. None of the operations below are connected to a production PHP server, external supplier, payment provider, or authentic multi-user stock ledger. Server rules must be enforced again when integrating into the PHP application.

## External reference research

1. [Microsoft Dynamics 365 — Inventory on-hand list](https://learn.microsoft.com/en-us/dynamics365/supply-chain/inventory/inventory-on-hand-list) — distinguishes physical, reserved, available, ordered and dimension-scoped stock. Design decision: present on-hand, reserved, quarantined and available separately and avoid equating a catalogue item with stock at one location.
2. [Microsoft Dynamics 365 — Item inquiry for warehouse mobile](https://learn.microsoft.com/en-us/dynamics365/supply-chain/warehousing/warehouse-app-item-inquiry) — short item/warehouse lookups and location-based available/reserved stock. Design decision: optimise item/ID/QR search and mobile stock cards.
3. [Odoo — Inventory and MRP documentation](https://www.odoo.com/documentation/master/applications/inventory_and_mrp.html) — goods receipts, internal transfers, count adjustments, reordering, barcode processing, lot/serial tracking, batch expiry and quality-controlled receipt flows. Design decision: separate receiving, issuing and movement history into explicit actions and statuses.
4. [NetSuite — Inventory Management Overview](https://docs.oracle.com/en/cloud/saas/netsuite/ns-online-help/article_161970666917.html) — real inventory decisions need stock on hand, committed quantities and replenishment visibility. Design decision: prioritise availability and work waiting rather than decorative KPI charts.
5. [NetSuite — Reorder point and safety stock](https://www.netsuite.com/portal/resource/articles/inventory-management/what-are-inventory-management-controls.shtml) — reorder point = lead time demand + safety stock. Design decision: demo threshold is the greater of manual minimum and estimated daily use × lead time + safety stock. Order suggestions restore the threshold and need human review.
6. [GS1 — Barcodes](https://asset.gs1.org/standards/barcodes) — identifiers for products, locations, lots/serial numbers and dates, and barcode formats for different use cases. Design decision: keep SKU identity separate from physical stock, allow barcode/GTIN references, and provide a batches/traceability view.

## PIM pages covered in the updated frontend

| Page | Primary task | Implemented for team review | Production integration required |
| --- | --- | --- | --- |
| Dashboard | Know what needs action | Quick actions first, dynamic local counts, low-stock list, operational panels | Role-filtered backend data and live notifications |
| Requests | Ask for, approve and issue materials | Create draft or submit, approve, reserve, issue, return, quantity checks | Approval policy, transactional issue and audit |
| Approvals | Make controlled decisions | PIM approval stages in the local demo | Authorised approver identity, concurrency, audit and escalation |
| Catalogue | Define items independently of stock | Unique SKU and barcode, units, categories, reorder settings, tracking mode | Reference data, product variants, unit conversion service |
| Inventory | See true stock availability | Location stock, on-hand, reserved, quarantined, available, movements | Authoritative stock ledger with transaction isolation |
| Purchasing | Purchase and receive | Draft → submitted → approved → sent, partial receipts, outstanding quantity and goods references | Supplier acknowledgement, invoices, inspection and 3-way match |
| Assets | Assign and account for equipment | Register, assign, return, custodian, condition and warranty | Asset history, authorisations, disposal, integrations |
| Projects | Track project consumption | Projects plus requests/allocations/material-use and budget views | Allocation cost accounting and project scope permissions |
| Suppliers | Manage vendors | Directory, lead time and linked purchase-order views | Supplier quality and delivery performance metrics |
| Maintenance | Plan service | Separate scheduled/repair/history views from source records | Work orders, maintenance scheduling and evidence |
| Stock counts | Check physical stock | Blind count entry, variance reason and confirmation before post | Count locks, variance approvals, audit reconciliation |
| Locations | Organise stock locations | Distinct location/site/warehouse/bin views | Hierarchy and location-scoped access |
| Budgets | Compare spending against plan | Approved/committed/spent views and linked open POs | Authoritative GL integration and currency conversions |
| Custody checks | Confirm asset holder | Status-based review views | Signed attestations, overdue escalation |
| Warranties | Track cover | Expiring and expired warranty records | Claims workflow and vendor warranties |
| People | See assigned obligations | Employee, cost centre and clearance contexts | Identity/HR integrations and offboarding controls |
| Imports | Validate upload headers | Required field presence and preview, no server import | CSV parser, data validation, row errors and atomic import |
| Reports | Understand movements/value | Stock valuation, movement ledger, PO analysis and CSV export | Reporting service, accurate costing and scheduled delivery |
| Replenishment | Prevent shortages | Reorder thresholds, suggested quantities and draft purchase request | Demand forecasting, open-order netting and supplier lead-time variability |
| Field app | Find records on site | Manual item/barcode lookup and source offline-state examples | Service worker, sync retries, conflict resolution |
| Transfers | Move between sites | Draft, dispatch and confirm receipt as separate steps | Transactional stock control and receiving evidence |
| Contracts | Track vendor agreements | Contracts, renewals and detail views | Document management and approval workflows |
| Kits | Group materials | Kit, component and assignment views | Stock allocation by component and serial constraints |
| Bookings | Schedule shared resources | Upcoming, personal and approval views | Calendars, conflicts, event notifications |
| Bills | Prepare supplier payments | Bill, payment preparation and balance views | Accounting, reconciliation and actual payments |
| Batches | Trace lots/expiry | Batch register, expiry, quarantine and serial-tracking view | Barcode parsing, FEFO, recall traceability and expiry enforcement |

## Business invariants demonstrated

- **Available** = on-hand − reserved − quarantined, measured per item and location. A negative-availability issue is blocked.
- Catalogue creation does not generate a receipt or stock movement.
- A material request moves through Draft → Awaiting approval → Approved → Allocated → Issued. Allocation reserves physical stock; issue releases that reservation and posts a stock movement. Damaged returned stock is quarantined.
- A purchase order has ordered, received and outstanding quantities. A receipt cannot exceed outstanding quantity. Draft orders cannot receive goods. Goods receipt references are preserved locally.
- A transfer dispatch reduces origin stock and becomes In transit. Destination inventory increases only after a separate receipt.
- A stock count shows a blind-count input, then a review of recorded vs system quantity. Adjustments with variance require a reason and cannot reduce reserved/blocked stock.
- Replenishment uses `max(manual reorder minimum, average daily use × lead time + safety stock)` for its threshold. It suggests a reviewable order to reach that threshold; it does not automatically procure.
- All example operations in this site are local to one browser. Data resets if the demonstration storage is cleared.

## Remaining work before production

1. Connect PHP/API endpoints with company, product edition, role and location permission checks. Client-side visibility is not authorisation.
2. Use durable, append-only stock movement records, idempotency keys, optimistic concurrency or serialisable transactions, and audit events.
3. Add quality inspection and quarantine release approval, FEFO/lot/serial traceability, expiry checks and product recall handling.
4. Add true procurement request → quotation → purchase order → receiving → invoice matching, with supplier bill approval and returns.
5. Add count variance approval by role, actual physical stock adjustments and cycle count schedules.
6. Add server-backed file import parsing and field-level error reporting. The current CSV check only previews headings and a few lines.
7. Add real field offline support with conflict resolution and retry markers; current offline data is example content only.
8. Test permission failures, race conditions, concurrent allocations, double approvals, negative stock, partial receiving and date/timezone edge cases with production backend fixtures.

## UI guardrails

- Top-level sidebar has six frequently used PIM destinations plus All modules. Secondary workflows live in local tabs and search.
- One PIM account context is shown in sidebar and header; no unrelated edition data is displayed in PIM record lists.
- Pages have one primary action, compact KPIs only where useful, readable tables on desktop and labelled record cards on mobile.
- Filters are specific to the selected page and should not manufacture records. Empty views explain that no records match.
- Use source-specific terms (Request, PO, SKU, On hand, Reserved, Available, Asset tag) rather than repurposing generic statuses.
