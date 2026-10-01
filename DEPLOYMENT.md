# Google Sheet activation

The Google Sheet backend is implemented; `config.js` is intentionally empty until its Apps Script web app is deployed. The site refuses check-ins until connected. It has no browser-storage fallback.

The organizer's private database link is provided outside this public repository. In Apps Script Project Settings → Script Properties, set `DATABASE_ID` to that spreadsheet's ID. Do not put the ID or private database URL in this repository.

1. Open the database as its owner → Extensions → Apps Script. Paste `backend/Code.gs`. Enable the manifest editor in settings and use `backend/appsscript.json`.
2. Deploy → New deployment → Web app, execute as the owner. Allow access for the intended participants. The app independently checks each passport ID and passphrase; it is not employee SSO. Keep the Sheet private.
3. Authorize spreadsheet access. Copy the deployed `/exec` URL into `window.PASSPORT_API_URL` in `config.js`; do not use `/dev`.
4. Repository Settings → Pages → Source: GitHub Actions. The workflow publishes only index.html and config.js.
5. Register from the published site, check in, confirm the Sheet row, retry the same day (still one row), then log in from another browser. Verify wrong credentials and connection failure. Delete test records from all four tabs before launch.

The connector cannot deploy Apps Script or configure Pages. Those steps require authorized browser access or owner action.

## Data

Participants holds ID, nickname, department, salt, passphrase hash and creation time. Checkins holds one record per participant/day, reflection, route and server timestamps. Feedback and Creations are voluntary text. All reads return only the authenticated participant's records. No localStorage/sessionStorage/IndexedDB is used; refresh requires login again.

Server lock prevents duplicate stamps. The backend validates task number, reflection length, safety quiz and final route. Check-in and feedback retries are safe. Creation submissions are append-only; a retry after an uncertain response can duplicate a work introduction. No public gallery or departmental data endpoint is provided.

Passport credentials protect individual records but do not verify employment. Registration is open to anyone able to access the web app. Organizers should match prize eligibility to their approved roster. Recovery is manual through the organizer. Never use a company password as the passport passphrase.

## Tests

Run `node backend/test.cjs`. Tests cover validation, wrong credentials, safety quiz, duplicate writes, session retrieval, formula escaping and consent. They use mocked Google services. Real Google Sheet writes and browser CORS behavior remain to be verified after deployment.
