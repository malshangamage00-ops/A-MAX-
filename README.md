# A-MAX Mobile E-Commerce Website

Modern mobile-shop e-commerce app built with **React + React Router + Tailwind CSS** and **Node.js + Express + SQLite**.

## Features

- Responsive storefront (Home, Shop, Product Details, Cart, Contact)
- Search and filter products by category/brand
- Stock status logic (In Stock, Low Stock, Out of Stock)
- Cart with localStorage persistence
- Firebase phone login (OTP) for wholesale mobile price access
- Protected mobile phones wholesale route (`/mobile-phones/wholesale`)
- Admin button in navbar opens dedicated `/admin` page
- Admin login with username/password
- Admin dashboard controls:
  - Add/Edit/Delete products
  - Mark out of stock / restock
  - Upload product images directly from PC
  - Change admin username/password from Security Settings

## Tech Stack

- Frontend: React, React Router, Tailwind CSS, Vite
- Backend: Node.js, Express, Multer
- Database: SQLite

## Run

```bash
npm install
npm run dev
```

- Dev stack started by `npm run dev`:
  - Frontend (Vite): `http://localhost:5173`
  - Main API (Express + SQLite): `http://localhost:5000`
  - Wholesale API (Express + Mongo): `http://localhost:5001`
- Proxy health checks:
  - Main API through Vite: `http://localhost:5173/api/health`
  - Wholesale API through Vite: `http://localhost:5173/wholesale-api/health`

If PowerShell blocks npm scripts:

```bash
npm.cmd run dev
```

## Firebase OTP Setup

1. Create a Firebase project and enable **Authentication -> Phone**.
2. In Firebase Console, open **Project Settings -> General -> Your apps -> Web app config**.
3. Copy the `apiKey`, `authDomain`, `projectId`, and `appId` values from that config object.
4. Create `.env` in project root (`D:\WEBSITES\A-MAx New\.env`) and paste values with `VITE_` prefix.
5. Example:

```env
VITE_FIREBASE_API_KEY=AIzaSy...your_real_key...
VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_APP_ID=1:123456789012:web:abcdef1234567890abcd12
```

6. In Firebase Console, add your local domain (`localhost`) as an authorized domain.
7. Restart the Vite dev server after editing `.env`.

Why this matters:

- Vite only exposes env vars that start with `VITE_`.
- `.env` must be in the project root, not inside `src/`.
- Dev server restart is required because Vite reads env vars at startup.

Flow:

- Open **Mobile Phones** category
- Not logged in -> redirect to `/login`
- Login with phone + OTP
- After verification, session is saved and user is redirected to wholesale page

Windows quick start:

- Double-click `start-dev.cmd` (auto-starts server if needed, then opens storefront)
- Double-click `start-admin.cmd` (auto-starts server if needed, then opens admin page)

If browser shows `ERR_CONNECTION_REFUSED` on `localhost:5173`:

- Run `start-dev.cmd` again and keep the server command window open.

Live Server mode (VS Code):

- Start Live Server (default workspace port: `5500`)
- Open `http://127.0.0.1:5500/index.html`
- If backend is not running, app automatically uses local fallback mode (products/admin) so UI still works.

Admin login reset (if credentials are changed/forgotten):

- Run `reset-admin.cmd`
- Default will be reset to: `admin / admin123`

## Admin Login
Default credentials (first setup):

You can also change credentials from Admin panel -> Security Settings.

## API Endpoints

Public:

- `GET /api/products`
- `GET /api/products/:id`
- `GET /api/health`

Admin auth:

- `POST /api/admin/login`
- `GET /api/admin/session`
- `POST /api/admin/logout`
- `POST /api/admin/change-credentials`
- `POST /api/admin/upload-image` (multipart form-data, field name: `image`)

Protected product management (admin token required):

- `POST /api/products`
- `PUT /api/products/:id`
- `PATCH /api/products/:id/stock`
- `DELETE /api/products/:id`

## Database

SQLite file: `server/data/store.db`

Tables:

- `products`
- `admin_credentials`

Schema: `server/db/schema.sql`
Seed data: `server/data/products.js`

