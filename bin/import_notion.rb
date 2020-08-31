#!/usr/bin/env ruby

require "time"
require "uri"
require "fileutils"
require "csv"
require "yaml"

# extract the zip
zip_path = "export.zip"
puts "Using zip: #{zip_path}"
fail "can't unzip" unless system("unzip -q -o #{zip_path} -d output")

puts "---"
# load posts
posts = Dir.glob("output/Website**/Posts**/**/*.md").to_a
posts.each do |post|
  puts "processing file: #{post.split("/").last}"

  content_lines = File.readlines(post)

  if content_lines.any? { |e| e.strip == "draft: Yes" }
    puts "skipping draft"
    next
  end

  date = content_lines.find { |e| e.start_with? "date: " }
  if date.nil?
    puts "skipping post without date"
    next
  end

  # get the date from the 'frontmatter'
  date = Time.parse(date[6..-2])

  # check if a slug has been set
  slugLine = content_lines.find { |e| e.start_with? "slug: " }
  slug = slugLine.nil? ? "" : [date.strftime("%Y-%m-%d"), slugLine[6..-1].strip].join("-")

  # find all the relative assets needed for the post
  assets = Dir.glob(post[0..-4]+"/*")

  # get the post title from the first line
  title = content_lines[0][2..-1].strip

  # make a safe url slug
  if slug == ""
    slug = [
      date.strftime("%Y-%m-%d"),
      title.gsub(/\W+/, " ").downcase.strip.gsub(" ", "-")
    ].join("-")
  end

  # remove the notion path for images, make relative.
  path_prefix = URI.encode(post.split("/")[-1].gsub(/\.md$/, ""))+"/"
  content = content_lines.join("").gsub(path_prefix, "")

  # correctly format md captions
  content.scan(/^\ncaption: .*/).each do |caption|
    content.gsub!(caption, "*"+caption.strip[9..-1]+"*")
  end

  # drop the first 6 lines
  content = content.split("\n")[6..-1].join("\n")

  # write the file to the content dir
  post_dir = "content/posts/#{slug}"
  fail "can't mkdir" unless system("mkdir -p #{post_dir}")

  markdown_content = <<-EOF
---
title: #{title}
date: #{date.strftime("%Y-%m-%d %T +0000")}
---

#{content}
EOF

  File.write("#{post_dir}/index.md", markdown_content)
  assets.each do |asset|
    FileUtils.cp(asset, post_dir)
  end
end

puts "---"
# load pages
pages = Dir.glob("output/Website**/Pages **/**/*.md").to_a
pages.each do |page|
  puts "processing file: #{page.split("/").last}"

  content_lines = File.readlines(page)

  # get the post title from the first line
  slug = content_lines[0][2..-1].strip

  title = content_lines.find { |e| e.start_with? "title: " }.gsub("title:", "").strip
  summary = content_lines.find { |e| e.start_with? "summary: " }.gsub("summary:", "").strip
  type = content_lines.find { |e| e.start_with? "type: " }.gsub("type:", "").strip

  content = content_lines[5..-1].join

  markdown_content = <<-EOF
---
title: #{title}
summary: #{summary}
type: #{type}
---

#{content}
EOF

  File.write("content/#{slug}.md", markdown_content)
end

puts "---"
# load projects
csvs = Dir.glob("output/Website**/Projects *.csv").to_a
fail if csvs.length != 1

puts "processing: #{csvs[0]}"
projects = []
CSV.read(csvs[0])[1..-1].each do |row|
  project = {
    "title" => row[0],
    "type" => row[1],
    "demo" => row[2],
    "github" => row[3],
    "paper" => row[4],
    "blog" => row[5],
    "talk" => row[6],
    "comment" => row[7],
  }

  projects << project.delete_if { |_, v| v.nil? }
end

content = File.read("content/projects.md")
content.gsub!(/projects:.*---/m, "projects:\n" + projects.to_yaml[4..-1] + "---")
File.write("content/projects.md", content)
