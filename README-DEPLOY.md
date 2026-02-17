# Deployment Guide for Plesk

This guide will help you deploy your Next.js application to a Plesk hosting environment using the `standalone` output mode.

## Prerequisites

- Access to your Plesk Control Panel.
- A domain or subdomain set up in Plesk.
- **Node.js** extension installed and enabled in Plesk.
- **MySQL** database support in Plesk.

## Step 1: Create the Database

1.  Log in to your Plesk Control Panel.
2.  Go to **Databases** in the left sidebar or under your domain dashboard.
3.  Click **Add Database**.
4.  Fill in the details:
    -   **Database name**: e.g., `benevolence_hub_db`
    -   **Database server**: Local MySQL (default)
    -   **Related site**: Select your website.
    -   **Database user name**: Create a user, e.g., `benevolence_user`
    -   **Password**: Create a strong password.
5.  Click **OK**.
6.  **Note down** the database name, username, and password. You will need these later.

## Step 2: Prepare Files for Upload

Since we are using Next.js `standalone` mode, we need to prepare a specific folder structure to upload.

1.  On your local machine, create a new folder named `deployment-package`.
2.  Navigate to your project folder: `C:\Users\Samuel.GetachewC\Downloads\Taye_Pro\Benevolence-Hub`
3.  Copy the **contents** of `.next\standalone` into your `deployment-package` folder.
    -   You should see `.next`, `package.json`, `server.js`, and `.env` inside `deployment-package`.
4.  **If it exists**, copy the `public` folder from your project root into `deployment-package\public`.
    -   If you don't have a `public` folder in your project root, skip this step.
5.  Copy the `.next\static` folder from your project root into `deployment-package\.next\static`.
    -   Create the `.next` folder inside `deployment-package` if it doesn't exist (it should be there from step 3), then create `static` inside it and copy the contents.
6.  Copy the `prisma` folder from your project root into `deployment-package\prisma`.
    -   This is needed to run database migrations on the server.
7.  **Zip** the `deployment-package` folder. Call it `deploy.zip`.

## Step 3: Upload Files to Plesk

1.  In Plesk, go to **Files** (File Manager).
2.  Navigate to the root directory of your website (usually `httpdocs`).
3.  **Delete** any default files (like `index.html`) if this is a fresh site.
4.  Click **Upload** and select your `deploy.zip` file.
5.  Once uploaded, select the file and click **Extract Files**.
6.  Ensure all files (`server.js`, `.next`, `public`, `package.json`, etc.) are in the root of `httpdocs` (or your chosen directory). If they extracted into a subfolder, move them out to the root.

## Step 4: Configure Node.js Application

1.  In Plesk, go to **Node.js** (or "Node.js App" under your website dashboard).
2.  Click **Enable Node.js** if it's not enabled.
3.  Configure the following settings:
    -   **Node.js Version**: Select the latest available (e.g., 20.x or 18.x).
    -   **Document Root**: This should be pointing to your `httpdocs` folder.
    -   **Application Mode**: Select `Production`.
    -   **Application Startup File**: Enter `server.js`.
4.  Click **Environment Variables** (or "Environment" button).
5.  Add the following variables:
    -   `DATABASE_URL`: `mysql://USER:PASSWORD@127.0.0.1:3306/DB_NAME`
        -   Replace `USER`, `PASSWORD`, and `DB_NAME` with the values from Step 1.
    -   `NEXTAUTH_SECRET`: Generate a random string (e.g., run `openssl rand -base64 32` locally or just mash your keyboard).
    -   `NEXTAUTH_URL`: Your full website URL (e.g., `https://example.com`).
    -   `PORT`: `3000` (Optional, Plesk usually handles this).
6.  Click **NPM Install**.
    -   This will install the dependencies listed in `package.json`.

## Step 5: Run Database Migrations

**Important**: Since we removed `prisma` from the production dependencies to avoid installation errors, you need to rely on `npx` or install it temporarily.

1.  In the Plesk Node.js dashboard, look for a button like **Run Script** or **Run Command**.
2.  Run the command: `npx prisma migrate deploy`
    -   If this fails saying `prisma` not found, try running `npm install prisma --save-dev` first via "Run Command", and then run the migration.
3.  **Alternative (SSH)**:
    -   If you have SSH access, log in to your server.
    -   Navigate to the app directory: `cd httpdocs`
    -   Run: `npx prisma migrate deploy`
4.  **Alternative (Plesk Scheduled Task)**:
    -   Go to **Scheduled Tasks** in Plesk.
    -   Add a task to "Run a command".
    -   Command: `cd httpdocs && /opt/plesk/node/20/bin/npm run db:migrate` (adjust Node path as needed).
    -   Run it once manually ("Run Now") and then delete the task.

## Step 6: Seed the Database (Optional but Recommended)

If you want the initial admin users:

1.  Run the seed command similar to the migration step:
    -   Command: `npx prisma db seed`
    -   Or via SSH: `npm run db:seed`

## Step 7: Restart the Application

1.  Go back to the **Node.js** dashboard in Plesk.
2.  Click **Restart Application**.

Your site should now be live!
