# Prime-UI

PRIME — Public Interactive Preview

A standalone, static interactive prototype of PRIME with three editions:

- PIM: Product Inventory Management
- RIM: Retail Inventory Management
- TIM: Tool Inventory Management

## Use

Open `index.html` in a browser or publish the folder from a static web host. No external scripts, fonts, accounts or installation required.

Users can navigate extensive edition-specific sidebars, expand workflows, search/filter records, view details, create session-local draft records, export CSV, use a demonstration point of sale, and leave browser-local feedback. The UI is responsive on desktop and mobile.

## Publish with GitHub Pages

1. The intended repository is `BankMoney24/Prime-UI`. Push these website files to the repository root, including `assets/`.
3. In Repository settings → Pages → Build and deployment, select Deploy from a branch → `main` → `/ (root)`. Save.
4. After GitHub Pages finishes deploying, open the URL displayed in Settings → Pages. On ordinary user accounts, it usually follows `https://<account>.github.io/<repo>/` but use GitHub's displayed URL, not a guessed link.

## Product and privacy boundaries

- This is an interface prototype, **not** a production ERP.
- All seeded data is fictional. No payments are processed. No personal or production records are accessed.
- Demonstration drafts and feedback use `localStorage` on each visitor's browser. They are **not shared back to the product owner**. A visitor can export their own saved feedback from Help → Leave feedback. To collect feedback centrally, connect a suitable approved form or backend endpoint.
- GitHub Pages is publicly viewable when enabled. Browser source files are inspectable by visitors, as with any front-end website. Do not put secrets, private API credentials, protected product documentation or conversation transcripts into this repository.

## File contents

- `index.html`: shell, metadata and application entry
- `styles.css`: responsive styles
- `app.js`: navigation registry, screens and interactive demonstration workflows
- `assets/prime-mark.svg`: PRIME icon
