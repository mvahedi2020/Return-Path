# Return Path

[Read the formatted product documents](https://mvahedi2020.github.io/Return-Path/docs/index.html).

Decide whether to invite someone back to an unfinished goal. Respect their contact preferences and timing limits, and explain when they should be left alone. Invitations are previews; nothing is sent. All records in this demo are fictional.

**Try it:** Inspect Aster’s unfinished walking plan, open its return destination, and preview the invitation timeline. [Open the demo](https://mvahedi2020.github.io/Return-Path/) · [Follow the walkthrough](docs/product/Sample_Walkthrough.md).

[Open the demo](https://mvahedi2020.github.io/Return-Path/) · [Product case](docs/product/Case_Study.md) · [Try the sample](docs/product/Sample_Walkthrough.md) · [Evidence & limits](docs/product/Validation.md)

The PM choice is to offer a small continuation of an unfinished goal before considering an invitation. A broad generic dormant-user blast was rejected because absence does not imply permission or useful value. Aster can choose the final stop in a saved walking plan; Juniper’s opt-out and Moss’s completed goal mean they should be left alone.

Choose among three original fictional cohorts and inspect two profiles in each. Preview Email, Push or In-app attempts at a fixed sample clock. Every accepted snapshot retains its policy and scope, explains eligible/suppressed outcomes and protects earlier attention limits when runs overlap. Policy revisions and reset have deliberate preview/cancel/confirm interactions. Compatible samples restore; corrupt/unreadable storage is preserved, with bounded reset Undo.

Nothing is sent. There are no real contact details, campaigns, notifications, accounts, tracking, APIs, analytics or live AI. Return destinations are local previews of fictional saved steps. No human research or retention result is claimed.

Mo owns product and program direction. AI assisted implementation and software verification. Decisions are provisional product judgments, not customer endorsement or claims of manual coding.

[Product brief](docs/product/Product_Brief.md) · [PRD and requirement mapping](docs/product/PRD.md) · [Sample contract](docs/product/Sample_Contract.md) · [Decisions and risks](docs/product/Decisions_and_Risks.md)

Product tradeoff: attention limits can suppress an otherwise eligible return invitation. The next investment depends on useful goal continuation and acceptable contact, with fatigue and opt-out guardrails. See the [case study](docs/product/Case_Study.md) for the proposed comparison and investment criteria.

## Run and reproduce the software checks

Use Node24 (see `.nvmrc`). The dependency versions and lockfile are pinned. Only port4192 is used; the static Pages base is `/Return-Path/`.

```sh
npm ci
npm run lint
npm run typecheck
npm run test
npm run build
npm audit --audit-level=high
npx playwright install chromium
npm run test:e2e
npm run preview
```

Open `http://127.0.0.1:4192/Return-Path/`. Stop a manual preview server before `test:e2e`, which starts and stops its own production preview on the same port. Linux CI installs Chromium with system dependencies. Build copies the product documents into `dist/docs` for the demo reviewer links. Generated output and browser artifacts are ignored; the runtime guard rejects unexpected public runtime configuration and tracked generated/environment files.

The GitHub workflow **Verify and publish demo** uses pinned Actions and runs locked install, lint, domain/storage tests, strict types/build, dependency audit and production browser checks before uploading the static Pages artifact. Exact observed checks and release gates belong to [Validation](docs/product/Validation.md).
