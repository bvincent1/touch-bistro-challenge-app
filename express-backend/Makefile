#!make
SHELL:=/bin/bash

include .env
export $(shell sed 's/=.*//' .env)


dev:
	@yarn nodemon ./src/server.ts
.PHONY: dev

typecheck:
	@yarn run tsc
.PHONY: typecheck

DB_CONNECTION="postgresql://$(POSTGRES_USER):$(POSTGRES_PASSWORD)@$(POSTGRES_HOST):$(POSTGRES_PORT)/$(POSTGRES_DB)"
migrate:
	@DATABASE_URL=$(DB_CONNECTION) npx drizzle-kit push
.PHONY: format
