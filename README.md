# 프로젝트 소개

<img src = "https://github.com/leesin1040/nplan_final_project/blob/travel/public/img/readmeTitle.JPG?raw=true">

## P를 위한 여행 가이드 <font color="#548dd4">NPLAN</font>

**서비스 :** [NPLAN](https://www.nplan.online/)

#### 즉흥 여행자를 위한 맞춤형 여행 플래닝 플랫폼

1. 여행 보드 생성 : 나만의 여행 일정 플래닝
2. 인근 관광지 추천
3. 커뮤니티 연결 : 여행지 추천 기사와 후기 작성이 가능한 게시판

# 목차

1. [프로젝트 소개](#프로젝트-소개)
2. [프로젝트 실행 방법](#프로젝트-실행-방법)
3. [기술적 도전 과제](#기술적-도전-과제)
4. [서비스 아키텍처](#서비스-아키텍처)
5. [기술 스택](#기술-스택)

# 프로젝트 실행 방법

```bash
# Clone
$ git clone https://github.com/leesin1040/nplan_final_project.git

# 라이브러리 인스톨
$ npm install

# 서버 실행
$ npm run start

## http://localhost:3000 실행 확인
```

### 환경변수

<details><summary>환경변수</summary>
<pre><code>
SERVER_PORT=3000

DB_HOST
DB_PORT
DB_USERNAME
DB_PASSWORD
DB_NAME
DB_SYNC

PASSWORD_HASH_ROUNDS
JWT_SECRET

TOUR_API_KEY

YOUR_EMAIL
YOUR_APP_PASSWORD

DB_PLACE_HOST
DB_PLACE_PORT
DB_PLACE_USERNAME
DB_PLACE_PASSWORD
DB_PLACE_NAME
DB_PLACE_SYNC

CLOUDFLARE_IMG
CLOUDFLARE_API

ELASTICSEARCH_NODE
DISCORD_WEBHOOK_URL

REDIS_USERNAME
REDIS_PASSWORD
REDIS_HOST
REDIS_PORT

UPDATE_KEY
</code></pre>

</details>

# 기술적 도전 과제

<details><summary>프로젝트 기술 도전과제</summary>
- 배치 스케쥴링을 통한  대용량 데이터 처리
	- 스케쥴링을 통한 정기적인 데이터 업데이트 처리
	- 배치 스케쥴 대상 데이터 : Es bulk indexing
- CI/CD 프로세스 적용
	- Docker Container 를 통한 배포
- 사용자가 선택한 여행장소의 경로표기 구현 및 효율적인 처리
	- 이전 선택지와 근접한 여행장소 검색 기능 구현
- Elasticsearch 를 위한 통합검색
</details>

# 서비스 아키텍처

<img src="https://github.com/leesin1040/nplan_final_project/blob/travel/public/img/service.JPG?raw=true">

# 기술 스택

- 언어 : Typescirpt
- Framework: Nest.JS
- RDBMS : MariaDB
- NoSql : Elastic Search
- Cache : Redis
- Infra
  - Webserver : CloudType
  - Static Images: Cloud Flare
- CI/CD :  Github  action, Docker container
- ORM: TypeOrm
- Frontend: HTML5, Bootstrap, EJS, CSS3, Javascript

<div align=center> <img src="https://img.shields.io/badge/javascript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=white"> <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=&logoColor=white"> </div>
<div align=center> <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white"> <img src="https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white"> </div>
<div align=center> <img src="https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white"> <img src="https://img.shields.io/badge/MriaDB-003545?style=for-the-badge&logo=mariadb&logoColor=white"> <img src="https://img.shields.io/badge/Elasticsearch-005571?style=for-the-badge&logo=Elasticsearch&logoColor=white"></div>
<div align=center> <img src="https://img.shields.io/badge/css3-1572B6?style=for-the-badge&logo=css3&logoColor=white"> <img src="https://img.shields.io/badge/html5-E34F26?style=for-the-badge&logo=html5&logoColor=white"> <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=JavaScript&logoColor=white"> <img src="https://img.shields.io/badge/bootstrap-7952B3?style=for-the-badge&logo=bootstrap&logoColor=white"></div>
<div align=center> <img src="https://img.shields.io/badge/GitHub Actions-2088FF?style=for-the-badge&logo=GitHub Actions&logoColor=white"> <img src="https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white">  </div>

# License

Nest is [MIT licensed](LICENSE).
