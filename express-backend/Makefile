#!make
SHELL:=/bin/bash

include .env
export $(shell sed 's/=.*//' .env)


help: ## Show this help
	@echo "\nSpecify a command. The choices are:\n"
	@grep -E '^[0-9a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[0;36m%-12s\033[m %s\n", $$1, $$2}'
	@echo ""
.PHONY: help

dev: ## run the app in dev mode
	@yarn nodemon ./src/server.ts
.PHONY: dev

typecheck: ## typecheck the app
	@yarn tsc
.PHONY: typecheck

migrate: ## run db migrations
	@yarn drizzle-kit generate
	@yarn drizzle-kit migrate
	@yarn drizzle-kit push
.PHONY: migrate

tests: ## run tests in watcher mode
	@yarn vitest
.PHONY: tests


services: ## run the supporting docker containers
	@docker compose -f ./docker-compose.yml --env-file .env up
.PHONY: services


seed: reset migrate ## seed the db with fixture values
	@yarn ts-node ./scripts/seed.ts
.PHONY: seed


DB_CONNECTION="postgresql://$(POSTGRES_USER):$(POSTGRES_PASSWORD)@$(POSTGRES_HOST):$(POSTGRES_PORT)/$(POSTGRES_DB)"
reset: ## Reset connected db
	@echo "drop schema public cascade; create schema public;" | psql $(DB_CONNECTION)
	@echo "drop schema drizzle cascade;" | psql $(DB_CONNECTION)
.PHONY: reset
