# 프로젝트 소개

<img src = "https://github.com/leesin1040/nplan_final_project/blob/travel/public/img/readmeTitle.JPG?raw=true">

## P를 위한 여행 가이드 <font color="#548dd4">NPLAN</font>

**도메인 주소 :** [https://www.nplan.online](https://www.nplan.online/)

#### 즉흥 여행자를 위한 맞춤형 여행 플래닝 플랫폼

1. 여행 보드 생성 : 나만의 여행 일정 플래닝
2. 인근 관광지 추천
3. 커뮤니티 연결 : 여행지 추천 기사와 후기 작성이 가능한 게시판

# 목차

1. [프로젝트 소개](#프로젝트-소개)
2. [참여 인원](#참여-인원)
3. [기능 소개](#기능-소개)
4. [서비스 아키텍처](#서비스-아키텍처)
5. [기술 스택](#기술-스택)

# 참여 인원

<table>
  <tbody>
    <tr>
    <td align="center"><a href="https://github.com/leesin1040"><img src="https://avatars.githubusercontent.com/u/74364209?v=4" width="100px;" alt=""/><br /><sub><b> 리더 : 최이진 </b></sub></a><br />ElasticSearch<br>front<br>CICD,Docker<br></td>
	 <td align="center"><a href="https://github.com/Han9526"><img src="https://avatars.githubusercontent.com/Han9526" width="100px;" alt=""/><br /><sub><b> 부리더 : 한승준 </b></sub></a><br />place<br>KAKAO MAP API<br>KAKAO mobility<br></td>
	<td align="center"><a href="https://github.com/jeongseon0"><img src="https://avatars.githubusercontent.com/u/86090167?v=4" width="100px;" alt=""/><br /><sub><b> 팀원 : 신정선 </b></sub></a><br />Redis<br>Tour API<br>lexoRank<br></td>
	<td align="center"><a href="https://github.com/halbebe"><img src="https://avatars.githubusercontent.com/u/146915373?v=4" width="100px;" alt=""/><br /><sub><b> 팀원 : 이하늘 </b></sub></a><br />로그인/회원가입<br>좋아요<br>댓글<br></td>
    </tr>
  </tbody>
</table>

# 환경변수

<p>
<details><summary>환경변수</summary>
<pre><code>
SERVER_PORT

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
</p>

# 기능 소개

<p>
<p>- 로그인/회원가입</p>
<p>- 여행 후기 게시판</p>
<p>- 좋아요 및 댓글</p>
<p>- 여행일정 생성</p>
<p>- 여행지 검색</p>
<p>- 사용자가 구성한 여행일정의 경로표기</p>
<p>- 이전 선택지와 근접한 여행장소 검색 기능 구현</p>
</p>

# 서비스 아키텍처

<img src="https://github.com/leesin1040/nplan_final_project/blob/travel/public/img/service.JPG?raw=true">

# 기술 스택

<div align=center> <img src="https://img.shields.io/badge/javascript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=white"> <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=&logoColor=white"> </div>
<div align=center> <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white"> <img src="https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white"> </div>
<div align=center> <img src="https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white"> <img src="https://img.shields.io/badge/MriaDB-003545?style=for-the-badge&logo=mariadb&logoColor=white"> <img src="https://img.shields.io/badge/Elasticsearch-005571?style=for-the-badge&logo=Elasticsearch&logoColor=white"></div>
<div align=center> <img src="https://img.shields.io/badge/css3-1572B6?style=for-the-badge&logo=css3&logoColor=white"> <img src="https://img.shields.io/badge/html5-E34F26?style=for-the-badge&logo=html5&logoColor=white"> <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=JavaScript&logoColor=white"> <img src="https://img.shields.io/badge/bootstrap-7952B3?style=for-the-badge&logo=bootstrap&logoColor=white"></div>
<div align=center> <img src="https://img.shields.io/badge/GitHub Actions-2088FF?style=for-the-badge&logo=GitHub Actions&logoColor=white"> <img src="https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white">  </div>

# License

Nest is [MIT licensed](LICENSE).

```bash
# Clone
$ git clone https://github.com/leesin1040/nplan_final_project.git

# 라이브러리 인스톨
$ npm install

# 서버 실행
$ npm run start

## http://localhost:SERVER_PORT 실행 확인
```
