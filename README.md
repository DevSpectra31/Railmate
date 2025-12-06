# Railmate

Railmate is a comprehensive logistics and station services platform for Indian Railways, combining parcel booking, real-time tracking, and station food ordering into a single application.

## Project Structure

- **Backend**: Node.js + Express + MongoDB
- **Frontend**: React + Vite + TailwindCSS

## Prerequisites

- **Node.js**: (v16 or higher recommended)
- **MongoDB**: Local instance running on `mongodb://localhost:27017`
- **Git**

## Quick Start

### 1. Backend Setup

The backend handles the API logic, database connections, and authentication.

1.  **Navigate to the backend directory:**
    ```bash
    cd Backend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Configure Environment Variables:**
    Create a `.env` file in the `Backend` directory with the following content:
    ```env
    PORT=8000
    MONGO_URI=mongodb://localhost:27017
    CORS_ORIGIN=*
    ACCESS_TOKEN_SECRET=your_super_secret_key_change_this
    ACCESS_TOKEN_EXPIRY=1d
    REFRESH_TOKEN_SECRET=your_refresh_secret
    REFRESH_TOKEN_EXPIRY=10d
    ORIGIN=*
    ```

4.  **Run the server:**
    ```bash
    npm run dev
    ```
    *The server will start on `http://localhost:8000`.*

### 2. Frontend Setup

The frontend provides the user interface for Customers, Vendors, and Admins.

1.  **Navigate to the frontend directory:**
    Open a new terminal and run:
    ```bash
    cd Frontend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Run the application:**
    ```bash
    npm run dev
    ```
    *The application will be accessible at `http://localhost:5173`.*

## Features & Usage

### Public Pages
- **Home**: `http://localhost:5173/` - Landing page.
- **Track Parcel**: `http://localhost:5173/track` - Enter a parcel ID to see its status.
- **Login**: `http://localhost:5173/login` - Sign in to access dashboards.
- **Register**: `http://localhost:5173/register` - Create a Customer account.

### Core Flows
1.  **Register/Login**: Create an account to access features.
2.  **Book Parcel**: Navigate to Dashboard > Book Parcel to submit parcel details.
3.  **Order Food**: Navigate to Dashboard > Order Food to browse station menus.

### Dashboards
- **User Dashboard**: View your active parcels and quick actions.
- **Vendor Dashboard**: (`/vendor`) Manage products and view orders.
- **Admin Dashboard**: (`/admin`) View system statistics.

## Tech Stack
-   **Frontend**: React, React Router DOM, TailwindCSS, Axios, Lucide React.
-   **Backend**: Express.js, Mongoose, JWT, CORS, Dotenv.
