exit if ARGV.size != 2

title = ARGV[0]
url = ARGV[1]

template =
%q{---
title: {{TITLE}}
date: {{DATE}}
url: {{URL}}
---}

slug = title.downcase.gsub(/[^\w\s]/, '').strip.gsub(/\s+/, '-')
date_string = Time.now.strftime("%Y-%m-%d")
path = "source/articles/#{date_string}-#{slug}.html.markdown"
contents = template
             .gsub("{{TITLE}}", "\"#{title}\"")
             .gsub("{{DATE}}", Time.new.to_s)
             .gsub("{{URL}}", url)

File.open(path, 'w').write(contents)
puts path + " Saved."
