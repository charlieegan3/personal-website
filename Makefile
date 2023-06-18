FILE_PATTERN := 'yaml\|html\|go\|sql\|Makefile\|js\|css\|scss'
dev_server:
	find . | grep $(FILE_PATTERN) | GO_ENV=dev entr -c -r go run cmd/tool.go

watch_test:
	find . | grep $(FILE_PATTERN) | entr -c go test ./pkg/...
