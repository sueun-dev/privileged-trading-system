-- database/schema.sql

-- Ranks Table (먼저 생성해야 Users 테이블에서 참조할 수 있습니다)
CREATE TABLE Ranks (
    rank_id INT PRIMARY KEY,
    rank_name VARCHAR(50) NOT NULL,
    required_referrals INT NOT NULL,
    commission_rate DECIMAL(5,2) NOT NULL
);

-- Users Table
CREATE TABLE Users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    tron_wallet_address VARCHAR(100) NOT NULL,
    referral_id INT NULL,
    rank_id INT NOT NULL DEFAULT 1,
    is_active TINYINT(1) NOT NULL DEFAULT 0,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NULL,
    FOREIGN KEY (referral_id) REFERENCES Users(user_id) ON DELETE SET NULL,
    FOREIGN KEY (rank_id) REFERENCES Ranks(rank_id) ON DELETE RESTRICT
);

-- Transactions Table
CREATE TABLE Transactions (
    transaction_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    txid VARCHAR(100) NOT NULL UNIQUE,
    amount DECIMAL(18,8) NOT NULL,
    status ENUM('Pending', 'Approved', 'Rejected') NOT NULL DEFAULT 'Pending',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NULL,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE
);

-- Commissions Table
CREATE TABLE Commissions (
    commission_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    amount DECIMAL(18,8) NOT NULL,
    type ENUM('Referral Level 1', 'Referral Level 2', 'Rank Bonus') NOT NULL,
    description VARCHAR(255) NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE
);

-- CompanyWallets Table
CREATE TABLE CompanyWallets (
    wallet_id INT PRIMARY KEY,
    wallet_name VARCHAR(50) NOT NULL,
    address VARCHAR(100) NOT NULL,
    balance DECIMAL(18,8) NOT NULL DEFAULT 0,
    updated_at DATETIME NULL
);

-- Initial Data for Ranks
INSERT INTO Ranks (rank_id, rank_name, required_referrals, commission_rate) VALUES
(1, '1 Star', 10, 40.00),
(2, '2 Star', 20, 20.00),
(3, '3 Star', 50, 20.00),
(4, '4 Star', 80, 10.00),
(5, '5 Star', 120, 10.00);

-- Initial Data for CompanyWallets
INSERT INTO CompanyWallets (wallet_id, wallet_name, address) VALUES
(1, 'Company Profit Wallet', 'TGAntoP81FhTDm4qLXWRUqEQkk4rhn2Zos'),
(2, 'Employee Reward Wallet', 'SecondWalletAddressHere');
