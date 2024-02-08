## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## License

Nest is [MIT licensed](LICENSE).

## 환경변수

SERVER_PORT=

DB_HOST=
DB_PORT=
DB_USERNAME=
DB_PASSWORD=
DB_NAME=
DB_SYNC=true

PASSWORD_HASH_ROUNDS=
JWT_SECRET=

## Swagger 접속 주소

http://localhost:3000/api-docs

```
NPlan_final_project
├─ .eslintrc.js
├─ .prettierrc
├─ DockerFile
├─ README.md
├─ api-docs
│  ├─ apidoc.json
│  ├─ article.http
│  ├─ auth.http
│  ├─ day.http
│  ├─ place.http
│  ├─ schedule.http
│  └─ travel.http
├─ nest-cli.json
├─ package-lock.json
├─ package.json
├─ public
│  ├─ css
│  │  ├─ days.css
│  │  ├─ login.css
│  │  ├─ main.css
│  │  ├─ postingArticle.css
│  │  ├─ schedule.css
│  │  ├─ signup.css
│  │  ├─ style.css
│  │  └─ travelDetail.css
│  ├─ img
│  │  ├─ headerImg.jpg
│  │  ├─ icons8-suitcase-48.png
│  │  └─ title.jpg
│  ├─ script
│  │  ├─ createTravel.js
│  │  ├─ days.js
│  │  ├─ login.js
│  │  ├─ myTravels.js
│  │  ├─ postArticle.js
│  │  ├─ schedule.js
│  │  ├─ signup.js
│  │  ├─ test.place.js
│  │  ├─ travel.js
│  │  ├─ travelDetail.js
│  │  ├─ updateArticle.js
│  │  └─ userinfo.js
│  └─ test.place.html
├─ src
│  ├─ app.controller.spec.ts
│  ├─ app.controller.ts
│  ├─ app.module.ts
│  ├─ app.service.ts
│  ├─ article
│  │  ├─ article.controller.ts
│  │  ├─ article.module.ts
│  │  ├─ article.service.ts
│  │  ├─ dto
│  │  │  └─ article.dto.ts
│  │  └─ entities
│  │     └─ article.entity.ts
│  ├─ auth
│  │  ├─ auth.controller.spec.ts
│  │  ├─ auth.controller.ts
│  │  ├─ auth.module.ts
│  │  ├─ auth.service.spec.ts
│  │  ├─ auth.service.ts
│  │  ├─ dtos
│  │  │  ├─ login.dto.ts
│  │  │  └─ register.dto.ts
│  │  ├─ entities
│  │  │  └─ refreshToken.entity.ts
│  │  ├─ guards
│  │  │  └─ optional.guard.ts
│  │  ├─ interfaces
│  │  │  └─ jwt-payload.interface.ts
│  │  └─ strategies
│  │     ├─ jwt.strategy.ts
│  │     └─ local.strategy.ts
│  ├─ comment
│  │  ├─ comment.controller.spec.ts
│  │  ├─ comment.controller.ts
│  │  ├─ comment.module.ts
│  │  ├─ comment.service.spec.ts
│  │  ├─ comment.service.ts
│  │  └─ entities
│  │     └─ comment.entity.ts
│  ├─ configs
│  │  ├─ database.config.ts
│  │  └─ env-validation.config.ts
│  ├─ day
│  │  ├─ day.controller.spec.ts
│  │  ├─ day.controller.ts
│  │  ├─ day.module.ts
│  │  ├─ day.service.spec.ts
│  │  ├─ day.service.ts
│  │  ├─ dto
│  │  │  └─ day.dto.ts
│  │  └─ entities
│  │     └─ day.entity.ts
│  ├─ decorators
│  │  ├─ page.decorator.ts
│  │  └─ userInfo.decorator.ts
│  ├─ email
│  │  ├─ email.controller.ts
│  │  ├─ email.module.ts
│  │  └─ email.service.ts
│  ├─ like
│  │  ├─ entities
│  │  │  └─ like.entity.ts
│  │  ├─ like.controller.spec.ts
│  │  ├─ like.controller.ts
│  │  ├─ like.module.ts
│  │  ├─ like.service.spec.ts
│  │  └─ like.service.ts
│  ├─ main.ts
│  ├─ member
│  │  ├─ entities
│  │  │  └─ member.entity.ts
│  │  ├─ member.controller.spec.ts
│  │  ├─ member.controller.ts
│  │  ├─ member.module.ts
│  │  ├─ member.service.spec.ts
│  │  └─ member.service.ts
│  ├─ place
│  │  ├─ dto
│  │  │  └─ create-place.dto.ts
│  │  ├─ entities
│  │  │  └─ place.entity.ts
│  │  ├─ place.controller.spec.ts
│  │  ├─ place.controller.ts
│  │  ├─ place.module.ts
│  │  ├─ place.service.spec.ts
│  │  ├─ place.service.ts
│  │  └─ utils
│  │     ├─ address.mapping.ts
│  │     └─ category.mapping.ts
│  ├─ recommendation
│  │  ├─ dto
│  │  │  └─ recommendation.dto.ts
│  │  ├─ recommendation.controller.ts
│  │  ├─ recommendation.module.ts
│  │  └─ recommendation.service.ts
│  ├─ response
│  │  └─ dto
│  │     ├─ api.response.dto.ts
│  │     └─ token.response.dto.ts
│  ├─ schedule
│  │  ├─ dto
│  │  │  ├─ create-schedule.dto.ts
│  │  │  ├─ move-schedule.dto.ts
│  │  │  └─ update-schedule.dto.ts
│  │  ├─ entities
│  │  │  └─ schedule.entity.ts
│  │  ├─ schedule.controller.spec.ts
│  │  ├─ schedule.controller.ts
│  │  ├─ schedule.module.ts
│  │  ├─ schedule.service.spec.ts
│  │  └─ schedule.service.ts
│  ├─ travel
│  │  ├─ dto
│  │  │  ├─ create-travel.dto.ts
│  │  │  └─ update-travel.dto.ts
│  │  ├─ entities
│  │  │  └─ travel.entity.ts
│  │  ├─ travel.controller.ts
│  │  ├─ travel.module.ts
│  │  ├─ travel.service.spec.ts
│  │  └─ travel.service.ts
│  ├─ updateplace
│  │  ├─ entitiy
│  │  │  └─ update.place.entity.ts
│  │  ├─ update.place.controller.ts
│  │  ├─ update.place.module.ts
│  │  └─ update.place.service.ts
│  ├─ user
│  │  ├─ dtos
│  │  │  ├─ changepassword.dto.ts
│  │  │  └─ createuser.dto.ts
│  │  ├─ entities
│  │  │  └─ user.entity.ts
│  │  ├─ user.controller.spec.ts
│  │  ├─ user.controller.ts
│  │  ├─ user.module.ts
│  │  ├─ user.service.spec.ts
│  │  └─ user.service.ts
│  └─ views
│     ├─ pages
│     │  ├─ articleList.ejs
│     │  ├─ main.ejs
│     │  ├─ myTravels.ejs
│     │  ├─ oneArticle.ejs
│     │  ├─ postArticle.ejs
│     │  ├─ signup.ejs
│     │  ├─ travelDetail.ejs
│     │  ├─ updateArticle.ejs
│     │  ├─ userinfo.ejs
│     │  └─ 기본.ejs
│     └─ partials
│        ├─ boardCreateHeadImg.ejs
│        ├─ head.ejs
│        ├─ header.ejs
│        ├─ script.ejs
│        └─ travelDetailPageModals.ejs
├─ test
│  ├─ app.e2e-spec.ts
│  └─ jest-e2e.json
├─ tsconfig.build.json
└─ tsconfig.json

```
