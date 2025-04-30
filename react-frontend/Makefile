#!make
SHELL:=/bin/bash

include .env
export $(shell sed 's/=.*//' .env)



help: ## Show this help
	@echo "\nSpecify a command. The choices are:\n"
	@grep -E '^[0-9a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[0;36m%-12s\033[m %s\n", $$1, $$2}'
	@echo ""
.PHONY: help

dev: ## run the frontend in dev mode
	@yarn dev
.PHONY: dev

typecheck: ## typecheck the app
	@yarn run tsc
.PHONY: typecheck

format: ## format the files
	@yarn run eslint ./app --fix
	@yarn run prettier ./app --write
.PHONY: format


cypress: ## open the cypress tool
	@yarn cypress open
.PHONY: cypress