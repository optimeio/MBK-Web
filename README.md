# MBK Web

This repository contains the MBK Technology website:

- `frontend/` — React + Vite application for the public website.
- `backend/` — Express API for course listings, registrations, contacts, and admin operations.

## Production setup

### 1. Build the frontend

From the repo root:

```bash
npm run build
```

This generates the production-ready frontend at `frontend/dist/`.

### 2. Deploy frontend to Hostinger

Upload the contents of `frontend/dist/` to Hostinger's `public_html/` folder.

Recommended files to upload:

- `frontend/dist/index.html`
- `frontend/dist/assets/*`
- `.htaccess` (root)

If Hostinger supports uploading `.htaccess`, place the root `.htaccess` file in the `public_html` folder to enable SPA routing and HTTPS redirects.

### 3. Deploy backend to Render

The backend can be deployed as a separate Render service.

#### Recommended Render configuration

- Root directory: `backend/`
- Environment: Node
- Build command: `npm install`
- Start command: `npm start`
- Port: `5000`

#### Required environment variables

- `MONGO_URI`
- `MAIL_USER`
- `MAIL_PASS`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`
- `ADMIN_TOKEN`
- `FRONTEND_URL` (optional)
- `RENDER_URL` (optional)

### 4. Frontend API base URL

The frontend will use `VITE_BACKEND_URL`, if set at build time.

If no custom value is provided, it defaults to `https://mbk-web-1.onrender.com` in production.

Example build command:

```bash
cd frontend
VITE_BACKEND_URL=https://your-render-service.onrender.com npm run build
```

## GitHub deployment

This repo already contains a GitHub Actions workflow at `.github/workflows/deploy.yml` that builds the frontend and deploys `frontend/dist/` to Hostinger via FTP.

To deploy the backend on Render, connect the same GitHub repo in Render and point it to the `backend/` service.

## Helpful commands

- `npm run build` — build the frontend
- `npm run dev` — run frontend and backend locally
- `npm run start` — start backend locally
- `cd frontend && npm run preview` — preview built frontend locally
