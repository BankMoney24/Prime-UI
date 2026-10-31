# PIM QA and frontend verification

Reviewed: 31 October 2026

## Source and scope

- The updated frontend is based on the extracted `PRIME-Complete-Team-Frontend.zip` provided in the conversation.
- The GitHub repository was inspected separately, but the connected GitHub token does not have write access to `BankMoney24/Prime-UI`.
- The later PDF wireframes were explicitly excluded from this iteration.
- PIM is enhanced through `pim.js` and `pim.css` loaded by the shared `index.html` and `app.js`. RIM and TIM keep their original module render paths.

## Tests executed

- `node --check app.js`, `node --check pim.js`, `node --check data.js`.
- `node tests/qa.mjs` — original shared-shell checks.
- `node tests/interactions.mjs` — original core interaction simulations.
- `node tests/pim.mjs` — stock availability, PO receiving limits, request approval/issue, transfers, counts, module coverage.
- `node tests/pim-integration.mjs` — 25 page routes, shared shell, RIM/TIM preservation and representative HTML snapshots.
- `node tests/pim-workflows.mjs` — item creation, request submission, PO stage transitions, material returns, two-step count confirmation, exports and tabs.
- Markup snapshots were parsed with lxml to check each rendered screen has a page heading, sensible table structure and no `undefined` placeholders.

## Browser testing limitation

Browser automation navigation to local HTTP and file URLs returned `ERR_BLOCKED_BY_ADMINISTRATOR` in the available environment. Therefore, automated browser screenshot/layout checks at 360px, 768px and 1440px could **not** be completed here. Do not present this build as fully visually tested across browsers.

## Areas to review with the team after publishing

1. PIM dashboard: quick-action order, KPI clarity, low-stock cards, collapsed panels and mobile spacing.
2. All PIM module routes and tab destinations, including deeper modules via All modules.
3. Requests: draft/submission, approval, allocation, issue, partial/damaged returns.
4. Purchasing: create draft, submit, approve, send and partial receipt, confirming no double receipt.
5. Inventory: location filtering and calculated on-hand/reserved/available/quarantined figures.
6. Transfers: origin dispatch and destination receipt separation.
7. Counts: blind count, variance reason, preview and final post.
8. Catalogue: duplicate SKU/barcode validation and UoM/lot settings.
9. Keyboard Tab, Escape, scan manual fallback, focus rings, mobile table cards and dialog scroll.
10. RIM point of sale and TIM equipment navigation regressions.

## Production status

This ZIP is a frontend **team review prototype**. None of the local demonstration records should be mistaken for real ERP transactions. No PHP database schema or live API was modified.
