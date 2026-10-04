# Return Path product requirements

## User decision and scope

A product reviewer prepares a respectful return invitation for fictional dormant learners. The reviewer needs to see both the value offered and the reason to suppress an attempt. Mo owns product and program direction; AI assisted implementation and verification. Product assumptions are provisional until proposed research is conducted.

## Experience requirements

| Work package | Requirement | Working behavior | Evidence |
|---|---|---|---|
| S061 | Primary user, decision, alternative and smallest observable outcome | Concrete unfinished goal before eligibility; opt-out and completed goal exclusion | Product Brief, Case Study; primary browser journey |
| S062 | Original fictional inputs; interaction contract; distinct design | P01–P06 / C01–C03, explicit timestamps and channel consent; sand/ink/rose invitation and timeline | Sample Contract; schema checks |
| S063 | Working static entry and real navigation | Invitation, Local timeline, Care policy; destination preview; reviewer document links | Production browser and build checks |
| S064 | Dormant reason, unfinished goal, channel preference, quiet hours, frequency | Separate reason/goal/value/destination fields; every suppressed result explains protection | Independent domain examples; channel and boundary browser checks |
| S065 | Preview, local timeline, eligible/suppressed outcomes, policy revision | Preview/cancel/confirm six attempts; immutable run snapshots with scope and policy version; reviewed revisions | Timeline, duplicate, overlapping, policy history checks |
| S066 | State protection and recovery | Compatible restore, corrupt preservation, memory-only storage failures, exact preview binding; explicit reset and bounded Undo | Domain/storage and browser recovery tests |
| S067 | Keyboard, focus, narrow layout, announcements, honest PM evidence | Native modal, Escape/cancel, focus return, live status; 320/390 widths; exact walkthrough | Validation; production browser and visual checks |
| S068 | Public source/demo parity, reviewer route, product discussion | Reproducible local delivery package and accurate documents | Publication and personal review gates in Validation |

## Rules the reviewer accepts

1. A profile must have an unfinished eligible goal, no opt-out, consent for the selected channel and that channel as its preference. Permission on another channel does not transfer.
2. Quiet hours use fixed sample local offsets. Start is inclusive, end exclusive; 21:00–08:00 crosses midnight. Equal start/end is invalid, preventing an ambiguous all-day interval.
3. Baseline spacing is 72 hours and the ceiling is two eligible invitations in `(t − 7 days, t]`. Sample prior invitations count. Exact spacing is allowed; exact seven-day lower boundary is excluded.
4. The same profile and timestamp may be reviewed only once. Every accepted eligible or suppressed outcome reserves that attempt across channels. A rerun stays suppressed.
5. Frequency applies across channels and across accepted runs. A later reserved invitation is also protected against an earlier overlapping run. The strictest spacing and ceiling among the current policy and accepted run policies applies. Reset deliberately begins a new scenario.
6. Policy revisions affect future runs; they never rewrite a snapshot. Draft controls allow 24/72/168-hour spacing, 1/2/3 weekly ceiling and integer-hour quiet intervals.

## State and action acceptance

Preview is read-only. Cancel/Escape changes neither history nor saved bytes. Confirmation is bound to the exact action input, memory state, raw saved bytes and read availability. A changed selection, draft, compatible or corrupt saved value requires a fresh preview, even when the revision is equal.

Compatible state restores on refresh. An incompatible record remains preserved until a fresh reviewed reset. If reading storage or accessing its getter fails, the app keeps memory and never writes unseen bytes, even if writing works. Failed writes retain current memory with a refresh warning. A readability change invalidates the preview.

Reset clears all runs and policy versions. Undo restores only a compatible prior in-memory snapshot, once, before any next accepted action or refresh. Changed raw bytes expire Undo. Corrupt or previously unreadable state has no Undo. Histories are bounded at 30 runs and 30 policy versions; reaching a bound directs the reviewer to a reset.

## Proposed evaluation

Ask participants what value returning offers, why suppression occurred, which channel has permission and preference, and when another invitation would be allowed. Observe whether the destination feels like a continuation. Study fatigue through consented research rather than treating simulated eligibility as delivery or retention. No human sessions or commercial measurement have been performed.
