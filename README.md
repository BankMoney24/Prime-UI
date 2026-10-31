# PRIME — Inventory Management

Interactive public frontend for **PIM** (Product Inventory Management), **RIM** (Retail Inventory Management) and **TIM** (Tool Inventory Management). Designed for team walkthroughs and UI reviews.

## Start locally

You need no dependencies or build step. Run a static server in this directory:

```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000/#/pim/dashboard`.

Alternatively use `npx serve .` if Node is available. Use a local server because the application is written as JavaScript modules.

## Deploy to BankMoney24/Prime-UI

On a Mac with GitHub write access:

```bash
cd ~/Downloads/PRIME-Team-Review-Frontend
bash deploy-to-github.sh
```

The script checks the frontend, clones the latest `main` branch, updates only the web preview files, commits and pushes. It does not reset repository history, force-push or rely on a preexisting `.git` directory or `.gitignore` file. It can be rerun if the website needs updating.

In the GitHub repository's **Settings → Pages**, select **Deploy from a branch → main → / (root)**. GitHub Pages then serves the website at the address displayed in Settings → Pages (normally `https://bankmoney24.github.io/Prime-UI/`). Confirm the published address before sharing it.

The connected ChatGPT GitHub account may have read-only access. If so, push through your own authenticated Mac Terminal or give the connector write access.

## What's inside

- `index.html` — accessible app entry and metadata.
- `styles.css` — PRIME design tokens, responsive desktop and mobile UI, tables, modals, dashboard, focus states and navigation.
- `data.js` — fictional but domain-specific module schemas and sample records.
- `app.js` — shared shell, hash routing, PIM/RIM/TIM modules, search, Scan fallback, local forms, reviews and demo flows.
- `assets/prime-mark.svg` — PRIME logo.
- `tests/qa.mjs` and `tests/interactions.mjs` — Node tests of routes, screen rendering, sample schema and interactions.
- `docs/` — UX coverage, product decisions and a team review guide.
- `deploy-to-github.sh` — safe publishing script.

## Interaction guide

1. Switch between PIM, RIM and TIM from the product switcher.
2. Use the sidebar for common work; choose **All modules** for everything else.
3. Use **Quick actions** at the top of each dashboard.
4. Search by module, item name or ID. The Scan button allows manual lookup and camera scanning when the browser supports it.
5. Open record rows to inspect details. Demonstration forms create browser-local drafts.
6. RIM Point of Sale builds a local cart and simulates a sale without charging money.
7. Open **Team feedback** from Explore more or Help. Team members can share their comments centrally through [GitHub Issues](https://github.com/BankMoney24/Prime-UI/issues) if they have GitHub accounts.

## What this is not

This is a **frontend demonstration**. It does not perform production authentication, payments, approvals, inventory transfers, supplier procurement, shared messaging or persistent multi-user review. Example records, people and metrics are fictional. Drafts and comments stay in local browser storage, not a shared server. No production PHP files or databases are bundled in the website.

When integrating these frontend components into the actual PRIME PHP backend, retain its existing authentication, tenancy, role checks, transactions, CSRF protection, routes and audit behavior. The public website is not a replacement for those controls.

The frontend was based on the source implementation and previously supplied UI screenshots. It was not derived from the later PDF wireframes.
