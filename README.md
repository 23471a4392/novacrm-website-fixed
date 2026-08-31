# NovaCRM — Customer Relationship Management Website

A responsive, browser-based CRM dashboard built with HTML, CSS and vanilla JavaScript.

## Included

- Dashboard KPI cards and revenue visualization
- Contacts CRUD: create, edit, delete, search, status filtering, tags
- Deals pipeline: Lead → Qualified → Proposal → Negotiation → Won
- Tasks CRUD with owner, due date, priority and status
- Activity timeline
- Reports and sales analytics
- Workspace settings
- JSON export
- LocalStorage persistence
- Demo reset
- Responsive desktop/tablet/mobile layout
- Modal forms and toast notifications
- Large synthetic catalogs (contacts, deals, tasks, products, accounts, campaigns)
- CRM workflow rulesets

## Install

```bash
cd novacrm-website
npm install   # optional, for tests only
```

No runtime npm packages required.

## Build

```bash
npm run build
```

Static frontend — no compile step.

## Run

### Option A — Open file

Open `index.html` in a browser.

### Option B — Local server

```bash
python3 -m http.server 8000
# or
npm start
```

Open http://localhost:8000

### Option C — Docker

```bash
docker build -t novacrm .
docker run -p 8080:80 novacrm
```

## Tests

```bash
npm install
npm test
```

## Production expansion

Connect the UI to an API/database and add authentication, RBAC, audit logs, server-side validation, email/calendar integrations, file storage, pagination, import/export, notifications, and automated backups.

## License

Proprietary — All rights reserved. UNLICENSED.
