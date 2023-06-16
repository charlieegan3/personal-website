FILE_PATTERN := 'html\|go\|sql\|Makefile\|js\|css'
dev_server:
	find . | grep $(FILE_PATTERN) | GO_ENV=dev entr -c -r go run cmd/tool.go
