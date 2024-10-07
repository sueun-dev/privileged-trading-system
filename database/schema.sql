/*
  database/schema.sql 파일 설명
  
  이 파일은 데이터베이스의 테이블 구조를 정의한 SQL 스키마 파일입니다. 'schema.sql' 파일은 데이터베이스를 처음 생성할 때, 각 테이블의 구조를 명시적으로 정의하고 필요한 기본 데이터를 입력하여 데이터베이스의 초기 상태를 설정합니다.
  
  주요 테이블:
  1. Ranks: 사용자 계급 정보 저장. 사용자가 특정 조건을 만족할 때 주어지는 등급 정보를 관리합니다.
  2. Users: 사용자 계정을 저장하는 테이블. 사용자 정보, 지갑 주소, 추천인 등급 등을 포함합니다.
  3. Transactions: 사용자 트랜잭션 내역을 저장하는 테이블. 각 트랜잭션의 상태, 금액, 사용자와의 관계를 저장합니다.
  4. Commissions: 추천인 또는 계급 보너스로 받은 수당 정보를 저장하는 테이블입니다.
  5. CompanyWallets: 회사의 지갑 정보를 저장하는 테이블. 회사 이익 및 보너스를 관리하는 지갑 정보를 저장합니다.
  
  이 파일을 사용하여 데이터베이스 구조를 한 번에 정의하고 필요한 데이터를 초기화할 수 있어 일관된 데이터베이스 환경을 쉽게 구축할 수 있습니다.

  세부 설명:
  1. Ranks 테이블
     - rank_id: 각 계급의 고유 식별자 (기본 키).
     - rank_name: 계급 이름. 예를 들어 '1 Star', '2 Star' 등.
     - required_referrals: 해당 계급에 도달하기 위해 필요한 추천 수.
     - commission_rate: 해당 계급에서 받을 수 있는 수당 비율.

  2. Users 테이블
     - user_id: 각 사용자의 고유 식별자 (기본 키, 자동 증가).
     - username: 사용자의 고유 사용자 이름 (유일함).
     - password: 사용자의 비밀번호. 일반적으로 해시 형태로 저장됨.
     - tron_wallet_address: 사용자의 TRON 지갑 주소.
     - referral_id: 사용자를 추천한 추천인의 user_id. 같은 테이블 내의 사용자 참조 (자기 참조).
     - rank_id: 사용자의 계급을 나타내는 ID. 기본값은 1 (1 Star).
     - is_active: 사용자의 활성화 여부. 기본값은 0 (비활성화).
     - is_admin: 사용자가 관리자 권한을 가졌는지 여부. 기본값은 0 (관리자가 아님).
     - referral_code: 사용자의 추천 코드 (유일함).
     - created_at: 사용자의 계정 생성 시간. 자동으로 현재 시간으로 설정.
     - FOREIGN KEY (referral_id): 다른 사용자와의 관계를 나타내며, Users 테이블의 user_id를 참조.

  3. Transactions 테이블
     - transaction_id: 각 트랜잭션의 고유 식별자 (기본 키, 자동 증가).
     - user_id: 트랜잭션을 수행한 사용자 ID (Users 테이블과의 외래 키 관계).
     - txid: 트랜잭션의 고유 식별자 (유일함).
     - amount: 트랜잭션 금액 (소수점 8자리까지).
     - status: 트랜잭션의 상태 ('Pending', 'Approved', 'Rejected'). 기본값은 'Pending'.
     - created_at: 트랜잭션 생성 시간. 자동으로 현재 시간으로 설정.
     - updated_at: 트랜잭션의 마지막 수정 시간. 기본값은 NULL.
     - FOREIGN KEY (user_id): Users 테이블의 user_id를 참조하며, 사용자가 삭제되면 관련 트랜잭션도 삭제 (ON DELETE CASCADE).

  4. Commissions 테이블
     - commission_id: 각 수당의 고유 식별자 (기본 키, 자동 증가).
     - user_id: 수당을 받은 사용자 ID (Users 테이블과의 외래 키 관계).
     - amount: 수당 금액 (소수점 8자리까지).
     - type: 수당 유형 ('Referral Level 1', 'Referral Level 2', 'Rank Bonus').
     - description: 수당에 대한 추가 설명 (옵션).
     - created_at: 수당 생성 시간. 자동으로 현재 시간으로 설정.
     - FOREIGN KEY (user_id): Users 테이블의 user_id를 참조하며, 사용자가 삭제되면 관련 수당도 삭제 (ON DELETE CASCADE).

  5. CompanyWallets 테이블
     - wallet_id: 각 지갑의 고유 식별자 (기본 키).
     - wallet_name: 지갑의 이름 (예: 'Company Profit Wallet').
     - address: 지갑의 주소.
     - balance: 지갑의 잔액. 기본값은 0.
     - updated_at: 지갑의 마지막 수정 시간. 기본값은 NULL.

  초기 데이터:
  - Ranks 테이블에 5개의 기본 계급 ('1 Star' ~ '5 Star') 데이터를 삽입하여 사용자의 초기 등급을 관리합니다.
  - CompanyWallets 테이블에 회사의 지갑 정보를 초기화합니다 (예: 이익 지갑, 직원 보너스 지갑).

  //어드민 올리는법 user_id는 예시
  UPDATE Users SET is_admin = 1 WHERE user_id = 123;
*/

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
  FOREIGN KEY (referral_id) REFERENCES Users(user_id)
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