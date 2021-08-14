## Fastify GraphQL API

Written with [fastify](https://fastify.io) and [typescript](https://www.typescriptlang.org)

### Project setup

1. Clone repo
   ```bash
   git clone git@github.com:dannysofftie/fastify-graphl.git
   ```
2. Install dependencies
   ```bash
   yarn install or npm install
   ```
3. Set up environment variables

   Copy `.env.sample` file to `.env` and update the variables

   ```bash
   cp .env.sample .env
   ```

4. Run development server
   ```bash
   yarn dev or npm run dev
   ```

### Build for production

API is built to run on Docker. To deploy, run the deployment script

```bash
chmod +x deploy.sh && ./deploy.sh
```

Once built. the image will be pushed to Docker Hub. Login to your server,

1. Install Docker and Docker Compose

   > Install docker

   ```bash
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
   ```

   > Install docker compose

   ```bash
   # download docker compose
   sudo curl -L "https://github.com/docker/compose/releases/download/1.26.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

   # make binary executable
   sudo chmod +x /usr/local/bin/docker-compose
   ```

2. Pull and spin up the image

   ```bash
   # Create a folder in your home directory
   mkdir apps/server
   # Copy contents of deploy/docker-compose.yml file to docker-compose.yml
   vi docker-compose.yml
   # Pull image
   docker-compose pull
   # Start application instamce
   docker-compose up -d

   ```

3. Setting up token signing and verification certificates

   ```bash
   # create private key
   openssl genpkey -algorithm RSA -aes256 -out ./private.pem

   # create public key from generated public key
   openssl rsa -in ./private.pem -pubout -outform PEM -out ./public.pem
   ```

   Save generated keys in `certs` folder, at the project root. Save them as `private.pem` & `public.pem`
