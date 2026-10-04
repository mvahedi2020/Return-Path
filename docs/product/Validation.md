# Validation and evidence limits

Return Path uses original fictional inputs. Software verification checks the prototype's behavior; proposed human evaluation asks whether the experience serves people. Mo owns product and program direction; AI assisted implementation and verification. No research sessions, customer endorsement or commercial outcomes are claimed.

## Observed local checks

Observed on **October 3, 2026**, with Node **24.14.1** and the locked dependencies:

| Check | Result | Scope |
|---|---|---|
| Locked installation | Pass | `npm ci`;143 audited packages |
| Lint | Pass | Source, tests and configuration |
| Strict types | Pass | Production code and both test layers |
| Domain/storage tests | **40 passed** | Independent timing examples, consent/preference, quiet-hour boundaries, rolling week, out-of-order reservations, immutable snapshot replay, schema rejection, raw-byte/readability binding, getter/read/write failures, bounded reset Undo and history limits |
| Production browser suite | **33 passed** | Primary and recovery journeys, all three channels, opt-out/completed-goal exclusion, repeated and overlapping runs, policy history, changed selections/raw bytes, reset/Undo, read recovery disclosure, caps, document links and security metadata |
| Focus/visual regression subset | **6 passed** | Subset of the same 33 journeys, rerun after placing initial dialog focus on its explanation; not six additional unique flows |
| Production build | Pass | `/Return-Path/` base; product documents copied into build; Node/runtime/environment and tracked-artifact guards passed |
| Dependency audit | **0 vulnerabilities** | `npm audit --audit-level=high`; no high/critical findings |
| Browser errors and external requests | **0** | Every browser journey asserts no console/page errors and no requests outside the local app origin |
| Layout and accessibility | Pass | All invitation controls within 1280×633 for every profile; 320/390px invitation/policy/timeline/dialogs without horizontal overflow; Tab/Shift+Tab scope, Escape/cancel return, confirmation focus and live announcements |
| Visual browser review | Pass | Actual Chrome via agent-browser; inspected desktop, 320/390px full invitation, review dialog and accepted timeline screenshots |

The production suite uses Chromium against a built static preview on port 4192. It starts and stops its own server. The independent visual check used the installed Chrome executable with a unique session. Both the visual browser and manually started preview server were closed after review. Generated browser artifacts/screenshots are excluded from public source.

The first production replay found cancellation focus loss and a Tab boundary issue. Those were repaired and the full suite passed. Visual inspection then found that focusing a bottom action scrolled the long preview past its opening explanation; initial focus now starts on the dialog heading with the review at the top. The six relevant existing journeys were rerun successfully. A short-screen layout repair made all channel/start/preview controls visible at the required desktop size.

The primary hand oracle is Aster eligible / suppressed / eligible at Oct 3, Oct 4, Oct 10 16:00 UTC under the default policy, with Birch lacking Email consent throughout. Additional independently expected examples cover Fern’s exact 72h boundary, Clover’s exact 7d rolling-window boundary, local 01:00 quiet hours for Birch and opt-out/completed-goal exclusions. See [Sample Contract](Sample_Contract.md).

S061–S067 have implemented local behavior and evidence as mapped in [PRD](PRD.md). S068’s public release and personal discussion are governed by the gates below. Passing these software checks does not demonstrate human comprehension, usefulness, delivery or business impact.

## Proposed human evaluation

Recruit consenting learners with interrupted self-directed goals. Ask them to explain the offered value, destination, suppression reason, consent and preferred channel in their own words. Observe whether re-entry feels like continuation rather than repeated setup. Compare timing and frequency expectations, including choosing to be left alone. These are proposed methods; no participant study or retention measurement has been performed.

## Public release and review gates

Publication pending: the parent reviewer will independently review source, claims and browser journeys, create the public repository, enable Pages before pushing, and verify successful final-head **Verify and publish demo**, public/local head agreement, live/build/artifact parity and product document links. Public profile routing follows verified publication. Personal product discussion with Mo remains a separate review step and cannot be inferred from passing software checks.
