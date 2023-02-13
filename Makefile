update_week_notes:
	rclone sync "$(shell echo $$HOME)/Documents/Notes/Records/Weeknotes/" "content/weeknotes/"

