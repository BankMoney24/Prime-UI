# PIM dashboard and notifications — UI change log

## Visual refinements
- Introduced a consistent, single-stroke SVG icon set for PIM Quick actions, KPI cards, accordion headers and row actions.
- Matched the mobile reference's blue outlined Quick actions, two-column mobile grid and short verbs.
- Standardised **View** for item-level links and **View all** for module-level links. Row actions stay aligned beside item summaries.
- Prioritised requests and low stock, followed by My requests and compact analytics. Stock health now sits lower inside a collapsed card.
- Replaced dashboard plus/minus symbols with accessible up/down chevrons, including explicit labels and ARIA state.
- Added period choices Today, This week, This month, Annually. Stock value is a snapshot of tracked on-hand inventory, not a period transaction; receipt and movement counts follow the selected period.

## Notification improvements
- Unread count in header is derived from the same read-state list as the inbox.
- Inbox filters: All, Unread, Read; product filter: all/PIM/RIM/TIM.
- Contextual icons and descriptions, Recent/Earlier grouping, record-opening links.
- Read-state changes persisted to the browser. No server push or shared account feed is implied.

## Functional fixes
- Fixed a PIM detail panel reference to a shared notification helper that previously caused a recursive render.
- Dashboard **View** now selects the correct request and opens its detail panel after routing.
- Low-stock purchase actions open a PIM replenishment draft with the SKU/location populated.
- My requests / Low stock **View all** open the appropriate tab, not just the generic module.
- Added responsive rules for 360px–1440px, visible focus and 42px+ tap targets.

## Scope
- PIM dashboard, PIM request routing, shared notifications and small shared navigation labels.
- PIM domain rules for approvals, stock movements, goods receipts, counts and transfers were retained.
- Other PIM pages, RIM and TIM remain in the package without reimplementation.
- Source stays a static interactive demo, not an authenticated production ERP.

## Validation
- JS syntax checks and six Node test scripts pass.
- 30 browser interaction and viewport checks passed using Chromium with in-memory script injection (because navigation to localhost was blocked).
- Browser data persists only within a single origin and device; no multi-reviewer backend or real inventory writes.
