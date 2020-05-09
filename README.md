# Recipe Lab

Play with your food. A recipe collaboration web application.

The Docker workflow was adapted from [Node Docker Good Defaults](https://github.com/BretFisher/node-docker-good-defaults)

### Local Development Features

- **Dev as close to prod as you can**. docker-compose builds a local development image that is just like production image except for the below dev-only features needed in image. Goal is to have dev env be as close to test and prod as possible while still giving all the nice tools to make you a happy dev.
- **Prevent needing node/npm on host**. Installs `node_modules` outside app root in container so local development won't run into a problem of bind-mounting over it with local source code. This means it will run `npm install` once on container build and you don't need to run npm on host or on each docker run. It will re-run on build if you change `package.json`.
- **One line startup**. Uses `docker-compose up` for single-line build and run of local development server.
- **Edit locally while code runs in container**. docker-compose uses proper bind-mounts of host source code into container so you can edit locally while running code in Linux container.
- **Use nodemon in container**. docker-compose uses nodemon for development for auto-restarting node in container when you change files on host.
- **Enable debug from host to container**. opens the inspect port 9229 for using host-based debugging like chrome tools or VS Code. Nodemon enables `--inspect` by default in docker-compose.
- **Provides VSCode debug configs and tasks for tests**. for Visual Studio Code fans, `.vscode` directory has the goods, thanks to @JPLemelin.
- **Small image and quick re-builds**. `COPY` in `package.json` and run `npm install` **before** `COPY` in your source code. This saves big on build time and keep container lean.
- **Bind-mount package.json**. This allows adding packages in realtime without rebuilding images. e.g. `dce node npm install --save <package name>` (dosn't work on all systems)

### Production-minded Features

- **Use Docker build-in healthchecks**. uses Dockerfile `HEALTHCHECK` with `/healthz` route to help Docker know if your container is running properly (example always returns 200, but you get the idea).
- **Proper NODE_ENV use**. Defaults to `NODE_ENV=production` in Dockerfile and overrides to `development` in docker-compose for local dev.
- **Don't add dev dependencies into production image**. Proper `NODE_ENV` use means dev dependencies won't be installed in container by default. Using docker-compose will build with them by default.
- **Enables proper SIGTERM/SIGINT for graceful exit**. Defaults to `node index.js` rather then npm for allowing graceful shutdown of node. npm doesn't pass SIGTERM/SIGINT properly (you can't ctrl-c when running `docker run` in foreground). To get `node index.js` to graceful exit, extra signal-catching code is needed. The `Dockerfile` and `index.js` document the options and links to known issues.
- **Use docker-stack.yml example for Docker Swarm deployments**.

### Assumptions

- You have Docker and Docker-Compose installed (Docker for Mac, Docker for Windows, get.docker.com and manual Compose installed for Linux).
- You want to use Docker for local development (i.e. never need to install node/npm on host) and have dev and prod Docker images be as close as possible.
- You don't want to lose fidelity in your dev workflow. You want a easy environment setup, using local editors, node debug/inspect, local code repo, while node server runs in a container.
- You use `docker-compose` for local development only (docker-compose was never intended to be a production deployment tool anyway).
- The `docker-compose.yml` is not meant for `docker stack deploy` in Docker Swarm, it's meant for happy local development. Use `docker-stack.yml` for Swarm.

### Getting Started

To start local development first install dev dependencies with `npm i --only=dev` then...

- Running `docker-compose up` is all you need. It will:
- Build custom local image enabled for development (nodemon, `NODE_ENV=development`).
- Start container from that image with ports 80 and 9229 open (on localhost).
- Starts with `nodemon` to restart node on file change in host pwd.
- Mounts the pwd to the app dir in container.
- If you need other services like databases, just add to compose file and they'll be added to the custom Docker network for this app on `up`.
- Compose should detect if you need to rebuild due to changed package.json or Dockerfile, but `docker-compose build` works for manually building.
- Be sure to use `docker-compose down` to cleanup after your done dev'ing.

If you wanted to add a package while docker-compose was running your app:

- `docker-compose exec node npm install --save <package name>`
- This installs it inside the running container.
- Nodemon will detect the change and restart.
- `--save` will add it to the package.json for next `docker-compose build`

To execute the unit-tests, you would:

- Execute `docker-compose exec node npm test`, It will:
- Run a process `npm test` in the container node.
- You can use the _vscode_ to debug unit-tests with config `Docker Test (Attach 9230 --inspect)`, It will:
  - Start a debugging process in the container and wait-for-debugger, this is done by _vscode tasks_
  - It will also kill previous debugging process if existing.

## Database

To seed the database:

- Start the container `docker-compose up`
- Deploy prisma `docker-compose exec node npm run prisma-deploy`
- Seed the database `docker-compose exec node npm run prisma-seed`

## Editor Configuration

Recommended VSCode extensions:

- Prettier
- Stylelint
- Eslint
