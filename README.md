# ⚠️ Warning & Disclaimer

The files provided in this repository have been uploaded with client authorization, and only client-approved files are included. Some implementation details and sections have been omitted or adjusted as per the client’s requests.

---

# Blockchain-Based Trading System

This project is a blockchain-powered trading system developed to provide a secure, transparent platform for managing user transactions, reward distributions, and account statuses. Designed to support flexible reward structures and transparent operations, this system leverages blockchain technology to ensure all activities are traceable, auditable, and immutable.

## Project Overview

The project is structured in two main parts:
1. **Backend**: Node.js server to manage API requests, user data processing, transaction handling, and blockchain wallet integration.
2. **Frontend**: A React-based user interface allowing users to view account information, manage wallets, track transactions, and connect to blockchain services.

### Key Features

- **User Authentication**: Provides secure sign-up and login processes, ensuring that user data is protected and only authorized users can access specific areas.
- **Reward and Distribution Management**: The system distributes rewards based on user activity and rank, with various reward categories designed to incentivize active participation.
  - **Direct Reward**: Automatically calculates and allocates a predefined amount to a user’s direct connection.
  - **Indirect Reward**: Provides additional rewards based on the activity of indirect connections within the user's network.
  - **Company Revenue Allocation**: Reserves a portion of each transaction for company operational funds and outstanding performance awards.
  - **Rank-based Bonus**: Users earn bonuses based on their rank, with distributions set to predefined ratios.
- **Rank Management**: Users can achieve different ranks based on specific criteria. Higher ranks receive additional bonuses.
- **Monthly Reset**: All accounts are set to inactive on the first of each month to facilitate periodic account revalidation and activity tracking. Users must re-activate their accounts to access full functionalities.
- **Withdrawal and Fee Management**: Enables users to request withdrawals, with a specified percentage deducted as transaction fees.

## Project Structure

The repository structure is organized as follows:

### Backend
- **controllers/**
  - `adminController.js`: Manages administrator actions such as approving transactions, viewing user rewards, and system configurations.
  - `authController.js`: Handles user authentication processes, including registration and login.
  - `commissionController.js`: Manages reward calculations and distributions based on user activity and rank.
  - `transactionController.js`: Handles records of deposits and withdrawals.
  - `userController.js`: Manages user account information, including profiles and transaction history.

- **middlewares/**
  - `authMiddleware.js`: Verifies user permissions and ensures that only authorized users can access specific routes.

- **routes/**
  - `adminRoutes.js`: Defines routes for administrative actions, including reward management and user verification.
  - `authRoutes.js`: Manages user authentication routes.
  - `commissionRoutes.js`: Routes related to reward and bonus management.
  - `transactionRoutes.js`: Routes for managing deposits, withdrawals, and other financial records.
  - `userRoutes.js`: User profile and account-related routes.

- **utils/**
  - `addressUtils.js`: Utilities for managing and validating blockchain wallet addresses.
  - `commissionUtils.js`: Helper functions for calculating rewards based on user data and predefined criteria.

- **database/schema.sql**: SQL schema defining tables for user data, transactions, rewards, and rankings.
- **server.js**: Entry point for the backend server, responsible for initializing routes and middleware.
- **config.js**: Configuration file for managing environment variables, including database settings and blockchain integrations.

### Frontend
- **public/**
  - `index.html`: Main HTML template for the web interface.
  - `favicon.ico`, `logo192.png`, `logo512.png`, `manifest.json`, `robots.txt`: Supporting assets for Progressive Web App (PWA) capabilities.

- **src/components/**
  - `AdminDashboard.js`: Admin interface for overseeing user activity, configuring settings, and viewing rewards.
  - `Commissions.js`: Component displaying user-specific reward and bonus details.
  - `ConnectWallet.js`: Enables users to connect their blockchain wallet for secure transactions.
  - `Dashboard.js`: User dashboard showing account status, transaction history, and reward details.
  - `Login.js`: Login page for users.
  - `PrivateRoute.js`: Restricts access to authenticated users only.
  - `Referrals.js`: Interface for managing user connections and viewing network activity.
  - `Register.js`: User registration page.
  - `Transactions.js`: Displays transaction records, including deposits and withdrawals.
  - `Withdrawals.js`: Interface for users to request withdrawals and view withdrawal status.

- **src/styles/**
  - `App.css`, `Dashboard.css`: Stylesheets for the user interface.

- **App.js**: Main application component, configuring routing and global settings.
- **App.test.js**: Test file for primary components.
- **setupProxy.js**: Configures backend API proxy for development.
- **setupTests.js**: Initializes testing settings for the frontend.

## How to Run

1. Clone the repository:
   ```bash
   git clone <repository_url>
   ```
2. Install dependencies for both backend and frontend:
   ```bash
   cd backend
   npm install
   cd ../frontend
   npm install
   ```
3. Set up environment variables in `.env` files in the backend and frontend folders. Ensure correct configuration for database access, blockchain settings, and other necessary parameters.
4. Start the backend server:
   ```bash
   cd backend
   node server.js
   ```
5. Start the frontend development server:
   ```bash
   cd frontend
   npm start
   ```

## Technology Stack

- **Backend**: Node.js, Express, SQL (PostgreSQL)
- **Frontend**: React, HTML/CSS, Web3.js for blockchain interactions
- **Blockchain Integration**: Blockchain and smart contract setups for secure, transparent transactions

---

This platform has been carefully designed to prioritize security, transparency, and flexibility in reward management. Blockchain integration enables an auditable and immutable record of transactions, promoting trust and fairness.

**Disclaimer**: Only client-approved files have been uploaded, and certain sections have been modified or omitted as per the client's request.