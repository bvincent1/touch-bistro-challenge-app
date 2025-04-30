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
.PHONY: migrate

tests: ## run tests in watcher mode
	@yarn vitest
.PHONY: tests


services: ## run the supporting docker containers
	@docker compose -f ./docker-compose.yml --env-file .env up
.PHONY: services
