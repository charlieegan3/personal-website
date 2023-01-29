update_week_notes:
	rclone sync "$(shell echo $$HOME)/Documents/Notes/Records/Week Notes/" "content/week-notes/"
