#!/usr/bin/env ruby

require "time"
require "uri"
require "fileutils"
require "csv"
require "yaml"

# extract the zip
zip_path = "export.zip"
puts "Using zip: #{zip_path}"
fail "can't remove output dir" unless system("rm -rf output")
fail "can't unzip" unless system("unzip -q -o #{zip_path} -d output")

puts "---"
# load posts
posts = Dir.glob("output/Website**/Posts**/**/*.md").to_a
posts.each do |post|
  puts "processing file: #{post.split("/").last}"

  page_id = post.scan(/(\w+).md/).first.first

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
  pattern = "\([%\w]+#{page_id}/"
  content = content_lines.join("")
    .gsub(/\([%\w]+#{page_id}\//, "(")
    .gsub(/!\[[%\w]+#{page_id}\//, "![")

  # correctly format md captions
  content.scan(/^\ncaption: .*/).each do |caption|
    content.gsub!(caption, "*"+caption.strip[9..-1]+"*")
  end

  # drop the first 6 lines
  content = content.split("\n")[6..-1].
    map { |l| l.gsub(/\s+$/, "") }.
    join("\n")

  # write the file to the content dir
  post_dir = "content/posts/#{slug}"
  fail "clean old dir" unless system("rm -rf #{post_dir}")
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

  content = content_lines[5..-1].
    map { |l| l.gsub(/\s+$/, "") }.
    join("\n")

  markdown_content = <<-EOF
---
title: |
  #{title}
summary: |
  #{summary}
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
# title has some strange char at the start
keys = ["title"] + CSV.read(csvs[0])[0][1..-1]
CSV.read(csvs[0])[1..-1].each do |row|
  project = Hash[*keys.zip(row).flatten]
  project = Hash[*project.sort_by { |k, _| k }.flatten]

  projects << project.delete_if { |_, v| v.nil? }
end

content = File.read("content/projects.md")
content.gsub!(/projects:.*---/m, "projects:\n" + projects.to_yaml[4..-1] + "---")
File.write("content/projects.md", content)
