# BSH AI Passport 2.0 — AI Week prototype

A responsive, dependency-free static prototype for a 10-day AI Week learning game. It is deliberately isolated from the original AI-passport site and from the original Google Apps Script URL.

## What's included
- Ten revised tasks, with prompt-copy buttons, reflection and stamps.
- Day 8 safety quiz and Day 9 wholly fictional, shared marketing dataset.
- Explorer/Creator routes on Day 10.
- Seven-day participation milestone and 10-day Master milestone.
- Department challenge, optional Creation Wall and KPI dashboard **clearly labeled as demo**.
- Local-only preview nicknames, reflections, survey and text-based Creation Wall. Does not request employee IDs or collect real company data; no analytics or remote network operations.

## Preview
Open `index.html` directly in a browser, or serve it through any static web server. The site works on GitHub Pages without a build tool.

## Deploy to a separate GitHub Pages repository
1. Create a new public repository such as `AI-passport-week-2` in the **intended GitHub account** (or a private repository if your account's Pages policies support that). Do not use the original repository.
2. Upload `index.html` and this README to the new repo's default branch.
3. Open repository Settings > Pages > Build and deployment > Deploy from branch; choose `main` and `/(root)`.
4. Its expected Pages address will be `https://USERNAME.github.io/AI-passport-week-2/` **only after GitHub confirms deployment**.

## Production blockers / security
This is a **prototype**. Its browser localStorage is not identity verification, cross-device persistence, a tamper-proof completion record, or a valid prize draw source. Department progress and KPI data are sample UI values, not live reports. Public GitHub Pages cannot by itself protect employee-only content.

Before employees use this for an official activity, build an approved backend and integrate company authorization (SSO), a controlled participant directory, server-side task/date checking (Asia/Taipei), idempotent check-in writes and authoritative progress retrieval. For Google Apps Script/Sheets use only approved access and ensure the backend verifies authorization and consent independently; never embed secrets or a writable anonymous script endpoint in the public HTML. Implement a moderated, consent-based Creation Wall with approved storage, file scans and access rules; publish only opt-in aggregate departmental data with minimum group sizes. Set an actual launch schedule with the organizers. Complete an IT/privacy review and follow corporate branding/IP requirements. The prototype intentionally does not give production behavior a misleading appearance.

## QA smoke checks
1. Create nickname and department; refresh and see they persist on the **same** browser.
2. Each task asks for at least 12 characters of reflection. Day 8 also requires selecting sensitive examples 2, 3 and 4.
3. Seven stamps should unlock the local draw milestone; 10 show Master.
4. Day 10 allows either Explorer or Creator. Public demo boards must remain labeled demonstrative.