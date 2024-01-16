## 환경변수

`.env` 파일 생성 후 아래 내용 입력

```
SERVER_PORT=3000

DB_HOST=DB 주소
DB_PORT=DB 포트번호
DB_USERNAME=DB 사용자명
DB_PASSWORD=DB 비밀번호
DB_NAME=DB 이름
DB_SYNC=true

PASSWORD_HASH_ROUNDS=로그인 비밀번호 해시 생성 강도 (default: 10)
JWT_SECRET=JWT 생성 및 검증 키
```

## 실행 방법

```sh
npm install
npm run start:dev
```

## 설계 문서


## Swagger 접속 주소

http://localhost:3000/api
