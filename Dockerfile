# 베이스 이미지로 Node.js LTS 버전을 사용합니다.
FROM node:20-alpine AS development

# 작업 디렉토리를 설정합니다.
WORKDIR /usr/src/app

# package.json과 package-lock.json (또는 yarn.lock)을 복사합니다.
# Docker 캐시를 활용하기 위해 먼저 복사합니다.
COPY package*.json ./

# 의존성을 설치합니다.
# 프로덕션 빌드에서는 --only=production 옵션을 사용할 수 있습니다.
RUN npm install

# 소스 코드를 복사합니다.
COPY . .

# 애플리케이션을 빌드합니다.
RUN npm run build

# 프로덕션 환경을 위한 새로운 스테이지를 정의합니다.
FROM node:20-alpine AS production

# 인수를 정의합니다.
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package*.json ./

# 프로덕션 의존성만 설치합니다.
RUN npm install --only=production

# 빌드된 애플리케이션을 development 스테이지에서 복사합니다.
COPY --from=development /usr/src/app/dist ./dist

# 애플리케이션이 실행될 포트를 노출합니다.
EXPOSE 3000

# 애플리케이션을 실행하는 명령입니다.
CMD ["node", "dist/main"] 