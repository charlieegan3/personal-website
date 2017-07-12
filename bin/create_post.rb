#!/usr/bin/env ruby
#
raise if ARGV.size != 1

title = ARGV[0]

template =
%q{---
title: {{TITLE}}
date: {{DATE}}
---
}

slug = title.downcase.gsub(/[^\w\s]/, '').strip.gsub(/\s+/, '-')
date_string = Time.now.strftime("%Y-%m-%d")
path = "source/blog/#{date_string}-#{slug}.html.markdown"
contents = template
             .gsub("{{TITLE}}", "\"#{title}\"")
             .gsub("{{DATE}}", Time.new.to_s)

File.open(path, 'w').write(contents)
puts path + " Saved."
