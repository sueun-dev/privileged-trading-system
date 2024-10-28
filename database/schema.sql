-- Ranks Table (먼저 생성해야 Users 테이블에서 참조할 수 있습니다)
CREATE TABLE Ranks (
    rank_id INT PRIMARY KEY,
    rank_name VARCHAR(50) NOT NULL,
    required_referrals INT NOT NULL,
    commission_rate DECIMAL(5,2) NOT NULL
);

-- Users Table
CREATE TABLE Users (
  user_id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  tron_wallet_address VARCHAR(255) NOT NULL,
  referral_id INT,
  rank_id INT DEFAULT 1,
  is_active BOOLEAN DEFAULT 0,
  is_admin BOOLEAN DEFAULT 0,
  referral_code VARCHAR(255) UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (referral_id) REFERENCES Users(user_id),
  FOREIGN KEY (rank_id) REFERENCES Ranks(rank_id)
);

-- Transactions Table
CREATE TABLE Transactions (
    transaction_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    txid VARCHAR(100) NOT NULL UNIQUE,
    amount DECIMAL(18,8) NOT NULL,
    type ENUM('Deposit', 'Withdrawal') NOT NULL,
    status ENUM('Pending', 'Approved', 'Rejected') NOT NULL DEFAULT 'Pending',
    fee DECIMAL(18,8) DEFAULT 0,
    net_amount DECIMAL(18,8) DEFAULT 0,
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

-- Settings Table
CREATE TABLE Settings (
    setting_id INT PRIMARY KEY AUTO_INCREMENT,
    setting_key VARCHAR(50) NOT NULL UNIQUE,
    setting_value DECIMAL(18,8) NOT NULL,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Withdrawals Table
CREATE TABLE Withdrawals (
    withdrawal_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    amount DECIMAL(18,8) NOT NULL,
    fee DECIMAL(18,8) NOT NULL,
    net_amount DECIMAL(18,8) NOT NULL,
    status ENUM('Pending', 'Approved', 'Rejected') NOT NULL DEFAULT 'Pending',
    txid VARCHAR(100) UNIQUE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NULL,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE
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
(2, 'Employee Reward Wallet', 'SecondWalletAddressHere'),
(3, 'Pending Commissions Wallet', 'ThirdWalletAddressHere');

-- Initial Data for Settings
INSERT INTO Settings (setting_key, setting_value) VALUES
('deposit_amount', 150.00),
('withdrawal_fee', 5.00);

-- Withdrawals Table
CREATE TABLE Withdrawals (
    withdrawal_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    amount DECIMAL(18,8) NOT NULL,
    fee DECIMAL(18,8) NOT NULL,
    net_amount DECIMAL(18,8) NOT NULL,
    destination_address VARCHAR(255) NOT NULL, -- 송금 대상 주소 추가
    status ENUM('Pending', 'Approved', 'Rejected') NOT NULL DEFAULT 'Pending',
    txid VARCHAR(100) UNIQUE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NULL,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE
);
