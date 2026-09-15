# Weather Station Frontend

## Setup

Install the dependencies with:

```sh
make install
```

Use the development server with:

```sh
make dev
```

The `dev` target automatically configures the repository to use the versioned
Git hooks. The `pre-push` hook runs `make test build` and blocks the push if
either command fails.

Run the hook setup manually with:

```sh
make install-hooks
```