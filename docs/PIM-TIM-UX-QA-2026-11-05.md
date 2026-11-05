# PRIME — PIM and TIM page, modal, and usability QA

Date: 5 November 2026
Scope: standalone PRIME frontend. The industrial demo and its flow conventions were reviewed as a UI reference. This document is not an inspection certificate or a verification of the production PHP backend.

## Review source

- Baseline: `PRIME-Unified-PIM-TIM-Complete-Frontend-Nov-05.zip` and its corresponding source folder.
- Reference: previously uploaded `PrimeInventory-ToolControl-Demo.zip`, particularly its shared `ui.js` modal/drawer patterns, `issue.html`, `returns.html`, `tool.html`, and `exceptions.html`.
- Existing domain logic, inventory movements, approval rules, and TIM industry policies were retained rather than reimplemented.

## Resolved implementation issues

| Area | Issue observed | Implemented change |
|---|---|---|
| PIM modal forms | Required asterisks rendered as separate flex items, creating extra lines | Field caption now wraps label and required indicator together |
| PIM decisions | Headers had an unstructured Close button and inconsistent contextual help | Named/labelled dialog, icon close action, short action-specific helper text |
| PIM record details | Detail drawer looked different from form modal | Unified header/close treatment, clearer fact cards and scrollable drawer |
| PIM validation | Domain errors were shown without moving focus | Validation errors gain assertive announcement and programmatic focus |
| PIM generic modules | Missing schema could render `undefined name` | Safe fallback to the module title |
| TIM action forms | Most actions ended with an ambiguous `Save demo record` | Specific CTA per action, including issue, return, calibration, inspection, request, closeout |
| TIM field layout | Long single-column dialogs, especially on large screens | Two-column desktop form grids, full-width notes/critical checklists, sticky action footer |
| TIM safety feedback | Tool detail showed raw properties without the reasons for restrictions | Status-first record drawer, issue-blocking reasons, relevant record fields |
| TIM tool identity | Empty fields looked like blank values | `Unassigned` or `Not recorded` on relevant empty properties |
| TIM other records | Site, supplier, procurement or metric detail could produce a generic record placeholder | Type-aware, clearly illustrative detail views; no fake QR label for non-tools |
| TIM filters | Site selector wasn't respected by the tool record filter | Apply site filtering where location fields exist |
| TIM tables | `View all` on a page already displaying all its records reopened that same page | Remove misleading action; show visible counts and Clear filters on empty result |
| Keyboard and mobile | Keyboard focus and scroll behaviour differed between PIM/TIM dialogs | Shared Tab trapping, useful initial focus, background scroll lock, bottom-sheet layouts |
| UI quality | Page tables, focus, statuses and dialogs had inconsistent visual rhythm | Shared spacing, borders, hover/focus states, modal tokens and responsive treatment |

## Automated verification

- 13 existing and new Node test suites: **123 assertions passed**.
- Page sweep: **24 PIM module routes + 30 TIM routes** rendered without runtime JavaScript errors.
- Page interaction sweep: **34 modal openings**, **42 record drawer openings** verified.
- PIM/TIM core pages verified at **360, 390, 768, 1440px** without viewport-width overflow or JavaScript runtime errors.
- Browser workflows: PIM request create dialog, required fields, tab containment and escape close; PIM record drawer; TIM tool registration in quarantine; blocked tool issue warnings; calibration explicit tool choice; specific submit labels; and TIM site filtering.
- RIM POS smoke test passed; RIM domain code remains unchanged.
- Git deployment helper tested with a local bare Git remote, including a second run with no changes.

## Outstanding integration / acceptance work

This preview saves demonstration records in the visitor's browser. Before claiming operational use, PRIME still needs:

1. Authentication and server-side permissions for PIM and TIM.
2. Real stock transactions, inventory ledger reconciliation and server validation.
3. Real signature/authorisation evidence for tool issue, calibration, inspections and workpack closeout.
4. Shared, durable audit logs and protected versioned documents.
5. Reliable device-based offline queue and synchronisation, not only a browser demo.
6. End-to-end testing against the actual PHP backend, plus Safari/Firefox device checks.
7. Sector-specific operational rule review with the organisation's quality and safety leads.

The demo must never be used to certify the safe return to service of industrial equipment.
