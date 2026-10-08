# cPanel Production Deployment Guide (Suvarx)

This package contains production-ready deployments for:
1. **Backend Subdomain API**: `api.backend.suvarx.com`
2. **Frontend Subdomain Storefront**: `shop.suvarx.com`

---

## 📦 Zip Files Overview

- **`backend_cpanel_api.backend.suvarx.com.zip`**: Complete backend Express + Sequelize MySQL API.
- **`frontend_cpanel_shop.suvarx.com.zip`**: Complete production-built Next.js application (including `.next`, `public`, `server.js`).
- **`database.sql`**: Full database schema with default seed configurations.

---

## Step 1: Create the Subdomains in cPanel

1. Log into your **cPanel**.
2. Go to **Domains** -> **Domains** (or **Subdomains**).
3. Create the two subdomains:
   - Domain: `api.backend.suvarx.com` (Document Root: `/home/username/api.backend.suvarx.com`)
   - Domain: `shop.suvarx.com` (Document Root: `/home/username/shop.suvarx.com`)

---

## Step 2: Create & Import MySQL Database

1. In cPanel, navigate to **MySQL® Databases**.
2. Create a new database (e.g., `suvarx_db` or `cpaneluser_suvarx`).
3. Create a new database user and assign a strong password.
4. Add the user to the database with **ALL PRIVILEGES**.
5. Go to **phpMyAdmin**, select your newly created database, and click **Import**.
6. Upload and import `database.sql` (found inside the backend zip or package).

---

## Step 3: Deploy Backend (`api.backend.suvarx.com`)

1. Open **File Manager** in cPanel.
2. Navigate to the backend directory (`/home/username/api.backend.suvarx.com`).
3. Upload `backend_cpanel_api.backend.suvarx.com.zip` and **Extract** all files into this directory.
4. Edit the `.env` file in the directory:
   ```ini
   DB_HOST=localhost
   DB_USER=your_cpanel_db_user
   DB_PASSWORD=your_cpanel_db_password
   DB_NAME=your_cpanel_db_name
   DB_PORT=3306

   PORT=5000
   NODE_ENV=production

   JWT_SECRET=your_super_secret_jwt_key_here
   JWT_EXPIRES_IN=1d
   FRONTEND_URL=https://shop.suvarx.com,https://suvarx.com,https://www.suvarx.com

   ADMIN_EMAIL=admin@suvarx.com
   ADMIN_PASSWORD=your_secure_admin_password

   DB_SYNC_ALTER=false
   ```
5. Go to **Setup Node.js App** in cPanel:
   - Click **Create Application**.
   - **Node.js version**: `20.x` (or `18.x` / `22.x`)
   - **Application mode**: `Production`
   - **Application root**: `api.backend.suvarx.com`
   - **Application URL**: `api.backend.suvarx.com`
   - **Application startup file**: `server.js`
   - Click **Create**.
6. Under "Detected configuration files", click **Run NPM Install** (or access terminal and run `npm install --omit=dev`).
7. Click **Restart Application**.
8. Test your backend: Visit `https://api.backend.suvarx.com/api/products` in your browser. It should return a valid JSON response.

---

## Step 4: Deploy Frontend (`shop.suvarx.com`)

1. In **File Manager**, navigate to the frontend directory (`/home/username/shop.suvarx.com`).
2. Upload `frontend_cpanel_shop.suvarx.com.zip` and **Extract** all files.
3. Ensure `.env.production` contains:
   ```ini
   NEXT_PUBLIC_API_URL=https://api.backend.suvarx.com
   NODE_ENV=production
   ```
4. Go to **Setup Node.js App** in cPanel:
   - Click **Create Application**.
   - **Node.js version**: `20.x` (or `18.x` / `22.x`)
   - **Application mode**: `Production`
   - **Application root**: `shop.suvarx.com`
   - **Application URL**: `shop.suvarx.com`
   - **Application startup file**: `server.js`
   - Click **Create**.
5. Under "Detected configuration files", click **Run NPM Install**.
6. Click **Restart Application**.
7. Visit `https://shop.suvarx.com` to see your live storefront!

---

## 🔑 Default Admin Login

- **Admin URL**: `https://shop.suvarx.com/admin/login`
- **Default Email**: Configured via `ADMIN_EMAIL` in backend `.env` (e.g. `admin@suvarx.com`)
- **Default Password**: Configured via `ADMIN_PASSWORD` in backend `.env`
