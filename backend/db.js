// backend/db.js
/*
schema.sql: 데이터베이스의 구조를 정의하는 파일입니다. 
테이블 생성, 컬럼 정의, 외래 키 설정 및 초기 데이터를 삽입하는 SQL 명령어를 포함하여 데이터베이스의 스키마를 구성합니다. 
즉, 데이터베이스의 뼈대를 형성하고 데이터를 초기화하는 역할을 합니다.

db.js: 데이터베이스 연결을 설정하고 관리하기 위한 파일입니다. 
Node.js 애플리케이션에서 MySQL 데이터베이스에 접근하기 위해 필요한 연결 설정을 정의합니다. 
이 파일은 코드에서 데이터베이스와 상호작용하기 위한 접근을 관리합니다.
 */

// MySQL 데이터베이스와 연결하기 위해 mysql2/promise 모듈을 import
const mysql = require('mysql2/promise');

// 환경 변수 파일(.env)의 내용을 로드하기 위해 dotenv 모듈을 import
const dotenv = require('dotenv');
dotenv.config(); // .env 파일에 정의된 환경 변수들을 process.env에 로드

// MySQL 연결 풀을 생성하여 데이터베이스에 대한 연결 관리 설정
const pool = mysql.createPool({
  host: process.env.DB_HOST, // 데이터베이스 호스트명 (예: localhost 또는 IP 주소)
  user: process.env.DB_USER, // 데이터베이스 사용자 이름
  password: process.env.DB_PASSWORD, // 데이터베이스 비밀번호
  database: process.env.DB_NAME, // 데이터베이스 이름
  waitForConnections: true, // 모든 커넥션을 사용할 수 없을 때 대기하도록 설정
  connectionLimit: 10, // 최대 연결 개수 설정 (한 번에 10개의 연결만 허용)
  queueLimit: 0 // 대기 중인 연결 요청 수에 제한이 없음을 의미 (무제한 대기)
});

// pool 객체를 모듈로 내보내기 (다른 파일에서 이 연결 풀을 사용하여 데이터베이스와 상호작용)
module.exports = pool;