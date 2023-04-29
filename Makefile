FILE_PATTERN := 'html\|go\|sql\|Makefile\|js\|css'
dev_server:
	find . | grep $(FILE_PATTERN) | GO_ENV=dev entr -c -r go run cmd/tool.go

update_week_notes:
	rclone sync "$(shell echo $$HOME)/Documents/Notes/Records/Weeknotes/" "content/weeknotes/"

