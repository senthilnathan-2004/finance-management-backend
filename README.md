# Finance Management Backend

This is a complete backend system built for a finance dashboard application. It provides user management, record management, dashboard summaries, and role-based access control.

## Tech Stack
- **Node.js & Express**: API Framework
- **MongoDB & Mongoose**: NoSQL database and ODM for robust data modeling.
- **JWT (`jsonwebtoken`)**: Authentication and Authorization.
- **Bcrypt**: Password hashing.
- **Joi**: Input Validation.

## Installation & Setup

1. **Install Dependencies**
   npm install

2. **Environment Variables**
   PORT=3000
   JWT_SECRET=supersecret_finance_assessment_key_2026
   JWT_EXPIRES_IN=24h
   MONGO_URI = mongodb://127.0.0.1:27017/finance_control_system

4. **Start the Server**
   npm start


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

