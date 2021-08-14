#!/usr/bin/env bash
# install docker if not installed
if ! command -v docker &>/dev/null; then
    # remove older versions of docker
    sudo apt-get remove docker docker-engine docker.io containerd runc -y

    # add docker repositories
    sudo apt-get install apt-transport-https ca-certificates curl gnupg-agent software-properties-common -y

    # add Docker gpg key
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -

    # set up stable repositories
    sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs)  stable" -y

    # install docker
    sudo apt update && sudo apt install docker-ce containerd.io -y

    # add current user to docker group and refresh current shell
    sudo usermod –aG docker $USER

    # notify user to rerun script again
    echo -e "\n\e[0;32mAfter entering your password, rerun ./deploy.sh again to proceed\e[0;39m\n"

    # refresh current shell
    exec su $USER
fi

# install docker-compose if not installed
if ! command -v docker-compose &>/dev/null; then
    # download docker compose
    sudo curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

    # make binary executable
    sudo chmod +x /usr/local/bin/docker-compose
fi

# temp variable to hold existing .env file
EXISTING_ENV_FILE=.env.existing.file
PRODUCTION_ENV_FILE=.${1}.env

# ensure .env.production file exists
[ ! -f $PRODUCTION_ENV_FILE ] && echo -e "\e[0;33m$PRODUCTION_ENV_FILE file not found \n\e[0;32mCreate .target_image.env file and update all environment variables, e.g .iris_lite.env to build iris_lite. Refer .env.sample file\n" && exit

[ -f .env ] && mv .env $EXISTING_ENV_FILE

# copy $PRODUCTION_ENV_FILE to .env for the next steps
cp $PRODUCTION_ENV_FILE .env

# docker-compose.yml
EXISTING_DOCKER_COMPOSE_FILE=docker-compose.yml

# export the vars in .env into shell
export $(egrep -v '^#' .env | xargs)

# create docker-compose deployment file
echo -e "version: '3'

services:
    ${DOCKER_IMAGE_NAME}:
        build:
            context: .
            dockerfile: Dockerfile
        image: ${DOCKER_IMAGE_NAME}
        container_name: $DOCKER_IMAGE_NAME
        restart: unless-stopped
        networks:
            - ${DOCKER_IMAGE_NAME}_network
        ports:
            - '${MONGODB_PORT}:27017'
networks:
    ${DOCKER_IMAGE_NAME}_network:" | tee $EXISTING_DOCKER_COMPOSE_FILE >/dev/null 2>&1

# build docker image
docker-compose -f $EXISTING_DOCKER_COMPOSE_FILE build

# tag and push to docker hub
docker tag $DOCKER_IMAGE_NAME $DOCKER_HOST_USERNAME/$DOCKER_IMAGE_NAME || true
docker push $DOCKER_HOST_USERNAME/$DOCKER_IMAGE_NAME

mkdir -p ../deploy

echo -e "version: '3'

services:
    ${DOCKER_IMAGE_NAME}:
        image: $DOCKER_HOST_USERNAME/$DOCKER_IMAGE_NAME
        container_name: $DOCKER_IMAGE_NAME
        restart: unless-stopped
        volumes:
            - ${ROOT_STORAGE}:/data/db
        networks:
            - ${DOCKER_IMAGE_NAME}_network
        ports:
            - '${MONGODB_PORT}:27017'
networks:
    ${DOCKER_IMAGE_NAME}_network:" | tee '../deploy/docker-compose.yml' >/dev/null 2>&1

# remove dangling images and containers that aren't in use
docker rmi -f $(docker images -f 'dangling=true' -q) || docker container prune -f || true

# move back .env.existing file to .env
mv -f $EXISTING_ENV_FILE .env && rm docker-compose.yml

echo -e "\n\e[0;39mCreated image successfully."

echo -e "\n
\e[0;36mNext steps:
    \e[0;32m1. \e[0;36mImage built and ready for deployment.
    \e[0;32m2. \e[0;36mPushed to dockerhub at: \e[0;32m$DOCKER_HOST_USERNAME/$DOCKER_IMAGE_NAME
    \e[0;32m3. \e[0;36mTo deploy follow steps in deploy/README.md file."

echo -e "\nDone!.\n"
