# Finance Data Processing and Access Control Backend

This is a complete backend system built for a finance dashboard application. It provides user management, record management, dashboard summaries, and role-based access control.

## Tech Stack
- **Node.js & Express**: API Framework
- **MongoDB & Mongoose**: NoSQL database and ODM for robust data modeling.
- **Security**: Helmet, Express-Rate-Limit, HPP, XSS-Clean, and Mongo-Sanitize.
- **JWT (`jsonwebtoken`)**: Authentication and Authorization.
- **Bcrypt**: Password hashing.
- **Joi**: Input Validation.

## Features & Access Control Logic
- **Viewer**: Can only access the Dashboard summary data.
- **Analyst**: Can view Dashboard summaries and read Finance Records (with filtering).
- **Admin**: Has full access. Can manage users (roles, status), and manage all finance records (Create, Update, Delete).

## Installation & Setup

1. **Install Dependencies**
   \`\`\`bash
   npm install
   \`\`\`

2. **Environment Variables**
   The project has a default `.env` file set up:
   \`\`\`
   PORT=3000
   JWT_SECRET=supersecret_finance_assessment_key_2026
   JWT_EXPIRES_IN=24h
   \`\`\`

3. **Start the Server**
   \`\`\`bash
   npm start
   \`\`\`
   *(For development mode with auto-reload, run `npm run dev`)*

4. **Initial Setup (Auto-seeded Accounts)**
   When the database initializes, default accounts are created if they don't exist:
   - **Admin:** `admin@gmail.com` / `Admin123!`
   - **Analyzer:** `analyzer@gmail.com` / `Analyzer123!`

## API Documentation

### 1. Authentication (`/api/auth`)
- **`POST /api/auth/register`**
  Register a new user.
  Body: `{"name": "...", "email": "...", "password": "..."}`
  *Response contains the JWT token. Pass it via headers: `Authorization: Bearer <token>`*
- **`GET /api/auth/me`** - Get current logged in user profile.
- **`PUT /api/auth/me`** - Update name, email, or password.

### 2. User Management (`/api/users`) - **Admin Only**
- **`GET /api/users`** - List all users.
- **`PUT /api/users/:id/role`** - Update a user's role.
  Body: `{"role": "Analyst"}` *(Role options: Viewer, Analyst, Admin)*
- **`PUT /api/users/:id/status`** - Toggle user active/inactive status.

### 3. Finance Records (`/api/records`) - **Requires Auth**
- **`POST /api/records`** *(Admin Only)*
  Body: `{"amount": 100, "type": "income", "category": "Salary", "date": "2024-03-01", "notes": ""}`
- **`GET /api/records`** *(Admin, Analyzer)*
  Supports Advanced Filtering Query Params:
  - `type`: `income` | `expense`
  - `category`: String (e.g. `Salary`, `Food`)
  - `startDate` / `endDate`: ISO Date strings (`YYYY-MM-DD`)
  - `limit` / `offset`: For pagination (default: 10/0)
- **`GET /api/records/:id`** *(Admin, Analyst)*
- **`PUT /api/records/:id`** *(Admin Only)*
- **`DELETE /api/records/:id`** *(Admin Only)*

### 4. Dashboard (`/api/dashboard`) - **Requires Auth**
- **`GET /api/dashboard/summary`** *(All roles)*
  Returns:
  - **Summary**: Total Income, Total Expenses, Net Balance.
  - **Category Spread**: Aggregated totals per category.
  - **Monthly Trends**: Income vs Expense breakdown for the last 6 months.
  - **Recent Activity**: The 5 most recent transactions.

## Project Structure Overview
- `/src/config/db.js`: Initializes MongoDB connection using Mongoose.
- `/src/middlewares`: Contains `auth.middleware` for JWT validation, `role.middleware` for access control checks, and `error.middleware` for generic error boundary mappings.
- `/src/routes/`: Router modularization cleanly grouped by feature.
- `/src/controllers/`: Core business logic, queries, and validation schemas per feature limits.
# finance-management-backend
