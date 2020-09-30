#!/bin/bash

files=$(find content/ -type f | grep 'png\|jpe\?g')
maxWidth=1000

for f in $files
do
  imageWidth=$(identify -format "%w" "$f")

  if [ "$imageWidth" -gt "$maxWidth" ]; then
      mogrify -resize $maxWidth $f
  fi
done
