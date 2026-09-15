.PHONY: setup install install-hooks dev test build preview

setup:
	corepack enable
	corepack prepare pnpm@12 --activate
	
install:
	pnpm install --frozen-lockfile

install-hooks:
	git config core.hooksPath .githooks

dev: install-hooks
	pnpm dev

test:
	pnpm test

build:
	pnpm build

preview:
	pnpm preview