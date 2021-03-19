FROM ubuntu:focal as base

# upgrade and install build-essentials to later on build bcrypt and mongoose
RUN apt update && apt install curl wget gnupg -y \
    && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
    && apt-get update \
    && DEBIAN_FRONTEND=noninteractive apt-get install -y google-chrome-stable fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-kacst fonts-freefont-ttf libxss1 \
    --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

# install nodejs, git, and yarn
RUN curl -sL https://deb.nodesource.com/setup_14.x | bash - && DEBIAN_FRONTEND=noninteractive apt-get install -y nodejs git fonts-ipafont-gothic fonts-wqy-zenhei \
    fonts-thai-tlwg fonts-kacst fonts-freefont-ttf libxss1 --no-install-recommends && rm -rf /var/lib/apt/lists/* && npm i -g yarn

# also prevent puppeteer from downloading bundled chromium as it was installed above
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
# working directory
WORKDIR /app
COPY package.json yarn.lock ./
# 
# build and run tests
# 
FROM base as build
# install all dependencies, including devDependencies
RUN yarn --frozen-lockfile
# copy app sources
COPY . .
# build for production
RUN yarn prisma:migrate build-in-docker && yarn build
# install production dependencies
RUN yarn --production --frozen-lockfile
# 
# release stage
# 
FROM base as release
# copy production dependencies
COPY --from=build /app/node_modules ./node_modules
# copy _next build folder, next.config.js and package.json
COPY --from=build /app/dist ./dist
COPY --from=build /app/templates ./templates
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/graphql ./graphql
COPY --from=build /app/public ./public
# copy .env and package.json
# we don't need app source files
COPY --from=build /app/package.json /app/.env ./
# expose ports and define start command
EXPOSE 4000
CMD yarn start
