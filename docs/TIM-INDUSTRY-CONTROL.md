# TIM industrial implementation and research mapping

## What came from the provided Tool Control demo

The supplied `PrimeInventory-ToolControl-Demo.zip` contains 16 HTML interface pages plus shared JS/CSS. Its README describes an aviation tool-control simulation covering tool requests, custody, issue/return, toolbox scanning, signature capture with a demo PIN, missing-tool investigation, exception disposition, calibration, maintenance, audit history, offline queue and reporting. This implementation reuses **workflow ideas**, not the original interface code or demo PIN.

## Extended industries (new product design decisions)

Eleven isolated example profiles: aviation, maritime, steel/fabrication, oil/gas, construction, manufacturing/automotive, utilities, mining, rail, ports/logistics and aerospace. Configurable terminology, job references, example tools and site labels. This does not claim formal compliance for any of them.

## Permit / possession references

Oil and gas, utilities and rail profiles require an explicit permit or track-possession reference when requesting equipment. The issue step rejects approved records without the reference. The requirement is a sample site policy, not proof of permit validity or an external permit-system connection.

## New controlled closeout flow

1. Pick a workpack with its asset/job reference.
2. Reject closeout while any related toolbox issue remains open or return-blocked, while linked missing-tool investigations are unresolved, or while returned kit tools remain blocked by condition/service/inspection/certification.
3. For zero-controlled-tool work, require an explicit declaration rather than treating missing records as success.
4. Require all four sector-specific checks, a meaningful evidence reference and distinct operations and Quality confirmations.
5. A Quality or Admin *demonstration role* records `Closed (demo)` and a local audit event. Repeated submissions are rejected. No operational release or airworthiness certificate is created.
6. Offline closeout is queued for review; no state is marked closed until simulated online completion.

## New toolbox templates

Separate reference templates from physical serialised toolboxes. IDs must exist, duplicates are rejected, and templates cannot alter tool custodians, tool locations or physical availability. The previous New Toolbox demo action lacked a working form; the updated modal creates a reference-only template.

## Industry safety references (verify against your jurisdiction and procedures)

- EASA 145.A.40: equipment/tool controls, calibration traceability and recognised standards. https://www.easa.europa.eu/en/document-library/easy-access-rules/online-publications/easy-access-rules-continuing-airworthiness
- FAA 14 CFR Part 145: maintenance organisations, tools and calibration, where applicable. https://www.ecfr.gov/current/title-14/chapter-I/subchapter-H/part-145
- IMO SOLAS regulation II-1/3-13 (effective 1 January 2026): lifting appliances and anchor handling winches; applicability and exemptions must be checked. https://www.imo.org/en/mediacentre/pressbriefings/pages/raft-of-shipping-rules-in-force-from-1-january-2026.aspx
- OSHA 29 CFR 1910.179: frequent and periodic crane inspections in the US, where applicable. https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.179

**These references do not certify this application or set a uniform interval across every operator/site.** Organisation-specific policies, device manuals and regulatory approval prevail.

## Verification

Run all Node tests in `tests/`. New suites are `tim-closeout.mjs` (16 domain checks) and `tim-industry-screens.mjs` (6 integrated UI checks). Existing PIM/RIM/TIM suites must also continue to pass. The deployment script includes industrial JS, stylesheet, QR library and all tests. Do not treat a passing test suite as evidence that the production PHP workflows were exercised.
