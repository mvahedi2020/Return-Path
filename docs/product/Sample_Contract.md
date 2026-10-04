# Original fictional sample and state contract

The Northstar fixture was created for this prototype. Names are fictional labels, not identities or contacts. There are no email addresses, device identifiers, accounts or personal tracking records.

## Clock and calendar

The fixed sample clock is **2026-10-03 16:00:00 UTC**. The host wall clock never affects results. Starts are Oct 3 16:00 UTC, Oct 4 05:00 UTC and Oct 10 16:00 UTC. Each run attempts start, +24 hours and +168 hours, in that order, for both profiles in the cohort. Timestamps are canonical ISO UTC strings.

Profiles use fixed offsets (UTC−07:00, UTC+01:00, UTC+09:00), which intentionally do not model daylight saving or real jurisdictions. A duration day is exactly 24 hours; a rolling week is 168 hours. Displayed local dates are derived by adding the fixed offset to UTC. Default quiet hours are [21:00, 08:00), across midnight. The minimum gap uses absolute distance from all past and future reserved eligible invitations so out-of-order runs cannot squeeze between commitments.

## Profiles

| ID / cohort | Dormant reason and unfinished value | Consent / preferred | Offset / prior invitation |
|---|---|---|---|
| P01 Aster / C01 A draft waiting | Lost next step; three walking stops saved, choose final stop in about five minutes | Email, In-app / Email | −07:00 / Sep 30 16:00 UTC |
| P02 Birch / C01 | Mobile draft difficult; compare two balcony plants from saved light/space notes | Push, In-app / Push | +09:00 / none |
| P03 Clover / C02 Time to reconsider | Busy week; continue shading from last saved sketch in about ten minutes | Email, In-app / In-app | +01:00 / none |
| P04 Fern / C02 | Recent reminder before free time; one repair checklist item remains | Email / Email | −07:00 / Oct 1 16:00 UTC |
| P05 Juniper / C03 Leave room | Asked to stop invitations; saved recipe collection available voluntarily | None; opted out / In-app | −07:00 / none |
| P06 Moss / C03 | Original reading-corner goal finished; reference remains available | Email, Push, In-app / Email | +01:00 / none; ineligible |

Exact destination paths: P01 `/workspace/walking-plan/final-stop`; P02 `/workspace/planting-plan/compare`; P03 `/workspace/sketching/shading`; P04 `/workspace/repair-checklist/last-item`; P05 `/workspace/recipes/saved`; P06 `/workspace/reading-corner/completed`. These open a local destination preview, not a remote workspace.

Messages are original fixture text: “A small next step, {name}. {value} Return when it works for you.” The UI displays the heading, value and permission line separately.

## Independently calculated default outcomes

Fresh sample, policy v1 (72h, two per rolling week, quiet 21:00–08:00), Oct 3 16:00 UTC start. Attempts are Oct 3 16:00, Oct 4 16:00 and Oct 10 16:00 UTC.

| Cohort / channel / profile | Local time at first attempt | Start | +24h | +7d |
|---|---|---|---|---|
| C01 Email / Aster | Oct 3 09:00 −07:00 | Eligible: exactly 72h after seed | Suppressed:24h gap | Eligible: prior run at exact 7d lower boundary excluded |
| C01 Email / Birch | Oct 4 01:00 +09:00 | No email consent | No email consent | No email consent |
| C01 Push / Aster | Oct 3 09:00 −07:00 | No push consent | No push consent | No push consent |
| C01 Push / Birch | Oct 4 01:00 +09:00 | Quiet hours | Quiet hours | Quiet hours |
| C01 In-app / both | 09:00 / 01:00 | Preferred channel mismatch | Same | Same |
| C02 Email / Clover | Oct 3 17:00 +01:00 | Prefers In-app | Same | Same |
| C02 Email / Fern | Oct 3 09:00 −07:00 | 48h after seed: suppressed | Exactly72h after seed: eligible | Eligible:144h gap, only one in rolling week |
| C02 In-app / Clover | Oct 3 17:00 +01:00 | Eligible | 24h gap: suppressed | Eligible |
| C02 In-app / Fern | Oct 3 09:00 −07:00 | No In-app consent | Same | Same |
| C02 Push / both | 17:00 / 09:00 | No push consent | Same | Same |
| C03 any / Juniper | Oct 3 09:00 −07:00 | Opted out | Same | Same |
| C03 any / Moss | Oct 3 17:00 +01:00 | Goal complete | Same | Same |

Alternative start Oct 4 05:00 UTC: Aster/Fern are at Oct 3 22:00 local (quiet), Birch at Oct 4 14:00 local (Push can fit), Clover at Oct 4 06:00 local (quiet). Default C01 Push therefore gives Birch eligible / spacing suppression / eligible, and Aster no consent throughout.

With a fresh one-per-week policy, Aster's Sep30 seed suppresses Oct3 and Oct4; Oct10 is eligible. Clover has no seed: Oct3 eligible, Oct4 suppressed, Oct10 eligible because the Oct3 entry is exactly on the excluded lower boundary. These hand calculations are assertions, independent of generated UI summaries.

## Priority and immutable state

Explanations follow: completed goal → opt-out → missing channel consent → preference → exact-attempt duplicate → quiet hours → minimum spacing → weekly ceiling → future reservation protection → eligible. The most immediate protection is displayed; all rules remain enforced.

State schema1 contains revision, policy versions and run snapshots. Each run contains id, policyVersion, full policy, full scope and every outcome. Load validates exact field sets, bounded lengths, canonical fixture references, policy ranges, monotonic references, consecutive ids/revisions and every outcome by deterministic replay. Missing, unknown or altered records are incompatible. The app stores only this bounded fictional sample under `return-path.sample.v1`.

Action reviews capture full input, full memory state, exact raw bytes and readability. No constructor or preview write occurs. Reset is the only replacement route for incompatible data. Undo cannot resurrect corrupt data and never rewrites an unseen saved value. [Recovery walkthrough](Sample_Walkthrough.md).
