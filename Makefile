.PHONY: setup install install-hooks dev dev-fakeapi test build lint format format-check preview prod

setup:
	corepack enable
	corepack prepare pnpm@12 --activate
	
install:
	corepack pnpm install --frozen-lockfile

install-hooks:
	git config core.hooksPath .githooks

dev: install-hooks
	corepack pnpm dev

dev-fakeapi: install-hooks
	corepack pnpm exec vite --mode fakeapi

test:
	corepack pnpm test

lint:
	corepack pnpm lint

format:
	corepack pnpm format

format-check:
	corepack pnpm format:check

build:
	corepack pnpm build

preview:
	corepack pnpm exec vite preview --host 0.0.0.0 --port 5173

prod: build
	corepack pnpm exec vite preview --host 0.0.0.0 --port 5173