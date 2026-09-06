.PHONY: setup install dev test build preview

setup:
	corepack enable
	corepack prepare pnpm@12 --activate

install:
	pnpm install --frozen-lockfile

dev:
	pnpm dev

test:
	pnpm test

build:
	pnpm build

preview:
	pnpm preview