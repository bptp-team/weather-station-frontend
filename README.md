# Weather Station Frontend

## Setup

Install the **dependencies** with:

```sh
make install
```

Use the **development server** with:

```sh
make dev
```

This starts the Vite dev server for live reloading and is intended for local
work while developing the UI.

Use the **production-like local app** with:

```sh
make prod
```

This runs the production build first and serves the compiled static bundle with
Vite preview on `http://localhost:5173`.

The `dev` target **automatically configures** the repository to use the
**versioned Git hooks**. The `pre-commit` hook formats the source code and then
checks linting and formatting. The `pre-push` hook runs linting, formatting
checks, tests, and the production build. Each hook **blocks the operation** if
any command fails.

Run the **hook setup** manually with:

```sh
make install-hooks
```

## Code quality

Run the ESLint check with:

```sh
make lint
```

Format the source files locally with:

```sh
make format
```

Check formatting without changing files with:

```sh
make format-check
```

The GitHub Actions workflow runs `lint` and `format-check` as non-mutating
checks before the build and test steps. Formatting is performed locally by the
pre-commit hook, not by CI.

## Docker

The `Dockerfile` builds the app with **Node 22** and serves the generated
**static files** with **nginx** on **Alpine**. The **final image** contains
**only nginx and the build output**: **no Node, source code or dependencies**.

### Build

```sh
docker build -t weather-station-frontend .
```

The image is built with `VITE_WEATHER_API_URL` **empty**, so the app calls the
API on the **same address that serves the page** (`/api/...`). A **reverse
proxy** in front of the container **must send** `/api` **to the backend**.

To point the app to **another API address**, pass it at **build time** with
`--build-arg`. The backend must then **allow that origin through CORS**:

```sh
docker build --build-arg VITE_WEATHER_API_URL=https://api.example.com -t weather-station-frontend .
```

This value is **written into the JavaScript during the build**. Changing it
**requires a new image**. It is **not a secret** and **must never hold one**.

### Run

```sh
docker run -d --name weather-station-frontend -p 8080:8080 weather-station-frontend
```

Open `http://localhost:8080`. **No environment variables** are needed.

In **production**, bind to `127.0.0.1` so the container is **reachable only by
the reverse proxy** on the same machine:

```sh
docker run -d --name weather-station-frontend --restart unless-stopped -p 127.0.0.1:8080:8080 weather-station-frontend
```

### Verify

```sh
docker exec weather-station-frontend id    # uid=101(nginx) gid=101(nginx)
curl http://localhost:8080/healthz          # ok
docker image ls weather-station-frontend    # total image size
docker history weather-station-frontend     # size of each layer
```

### Image details

- **nginx** runs as the **non-root** `nginx` user from the base image
  (**UID and GID** `101`) and listens on port `8080`.
- The served files **belong to** `root`, so the **nginx** process **can read
  them but cannot change them**.
- `nginx/nginx.conf` keeps **nginx temporary files** under `/tmp`, sends
  `index.html` with `no-cache`, caches `/assets` for **one year** and answers
  `/healthz` for the **container health check**.
- `docker stop` sends `SIGQUIT`, which lets **nginx finish current requests**
  before the container stops.
- `.dockerignore` **blocks every file by default**. When the build starts
  needing a **new file** (for example `postcss.config.js`), **add it both** to
  `.dockerignore` **and** to a `COPY` instruction in the `Dockerfile`.
