#!/usr/bin/env ruby

require "time"

system("rm -rf charlieegan3/content/posts/*")
system("mkdir -p charlieegan3/content/posts")

Dir.glob("source/blog/*").each do |file|
  next if file.include?"rss.builder"
  next if file.include?"html.erb"

  folder_name = file.split("/").last.gsub(".html.markdown", "")
  `mkdir -p charlieegan3/content/posts/#{folder_name}`

  if File.directory?(file)
    Dir.glob("#{file}/*").each do |asset|
      content = File.read(asset)
      filename = asset.gsub("source/blog", "charlieegan3/content/posts")
      File.write(filename, content)
    end
  else
    content = File.read(file)
    content.gsub!(/([ \(])\/blog\//, '\1/posts/')
    lines = content.split("\n")
    segments = folder_name.split("-")
    permalink = "/blog/"+segments.take(3).join("/")+"/"+segments[3..-1].join("-")
    lines.map! do |l|
      if l.match(/^date:/)
        "date: #{Time.parse(l.split(" ")[1..-1].join(" ")).strftime('%Y-%m-%d %H:%M:%S %z')}"
      else
        l
      end
    end
    lines = [lines[0], "aliases:\n- #{permalink}", *lines[1..-1]]

    File.write("charlieegan3/content/posts/#{folder_name}/index.md", lines.join("\n"))
  end
end

puts "done"
