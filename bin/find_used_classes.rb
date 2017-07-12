#!/usr/bin/env ruby
#
`middleman build` rescue puts "build failed continuing"

used_classes = `find www`.split("\n")
  .select { |file| file.match(/(html|erb)$/) }
  .map { |file| File.read(file).scan(/class="?([\w\s_\-]+)"?/) }
  .flatten
  .join(" ")
  .split(/\s+/).uniq
  .sort

File.write(
  "source/stylesheets/used_classes.txt",
  used_classes.join("\n") + "\n"
)
