require 'metainspector'

raise if ARGV.size != 1

url = ARGV[0]

template =
%q{---
title: {{TITLE}}
date: {{DATE}}
url: {{URL}}
---}

title = MetaInspector.new(url).best_title

slug = title.downcase.gsub(/[^\w\s]/, '').strip.gsub(/\s+/, '-')
date_string = Time.now.strftime("%Y-%m-%d")
path = "source/articles/#{date_string}-#{slug}.html.markdown"
contents = template
             .gsub("{{TITLE}}", "\"#{title}\"")
             .gsub("{{DATE}}", Time.new.to_s)
             .gsub("{{URL}}", url)

File.open(path, 'w').write(contents)
puts path + " Saved."
