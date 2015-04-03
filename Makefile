test:
	@NODE_ENV=test ./node_modules/.bin/mocha \
		--require assert \
		--recursive \
		--growl \

.PHONY: test
