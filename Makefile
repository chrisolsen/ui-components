#### PROJECT SETUP
init:
	git config core.hooksPath .githooks

#### CREATE

# svelte library 
sl:
	npx nx generate @nxext/svelte:library $(name) --e2eTestRunner=none --skipFormat --no-interactive --buildable --publishable --importPath=@abgov/$(name)

# svelte component
sc:
	npx nx generate @nxext/svelte:component $(name) --project=web-components --no-interactive

# react component
rc:
	npx nx generate @nrwl/react:component $(name) --project=react-components --style=none --export --no-interactive

# new component
component: sc rc story

#### BUILD

build-web-components:
	npm run build web-components --withDeps --configuration production --verbose

build-styles:
	npm run build styles --withDeps --configuration production

build-react-components:
	npm run build react-components --withDeps --configuration production

build-ng-components:
	npm run build angular-components --withDeps --configuration production

build-react-app:
	npm run build react-demo --withDeps --configuration production

build-ng-app:
	npm run build angular-demo --withDeps --configuration production

build: build-styles build-web-components build-react-components build-ng-components build-react-app build-ng-app

#### RUN 

playground:
	cd libs/web-components && HOST=0.0.0.0 npm run playground

dev:
	cd libs/web-components && npm run dev

react-app:
	npx nx run react-demo:serve 

ng-app:
	npx nx run angular-demo:serve 

format:
	npm run format

#### TEST

lint:
	npx nx run-many --target=lint --projects=angular-components,react-components,web-components,styles

test:	
	npm run test:watch

coverage:	
	npx nx run web-components:test --codeCoverage

#### OTHER

ngrok:
	ngrok http $(port) --host-header=localhost

.DEFAULT_GOAL := build
