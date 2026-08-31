# NovaCRM Architecture

Browser CRM shell: `index.html` + `app.js` + `styles.css`.

- Demo state in LocalStorage
- Reference catalogs under `assets/data/` for contacts, deals, tasks, activities, products, accounts, campaigns
- CRM rulesets under `assets/data/crm_rules_*.js`
- Production: replace with authenticated API, RBAC, audit logs
