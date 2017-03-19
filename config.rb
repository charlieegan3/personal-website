activate :blog do |blog|
  blog.name = "timeline"
  blog.prefix = "timeline"
end

activate :blog do |blog|
  blog.name = "blog"
  blog.prefix = "blog"
  blog.layout = "post"
end

page '/blog/feed.rss', layout: false

# Change Compass configuration
# compass_config do |config|
#   config.output_style = :compact
# end

# Automatic image dimensions on image_tag helper
# activate :automatic_image_sizes

# Methods defined in the helpers block are available in templates
helpers do
  def odd_values(array)
    array.values_at(* array.each_index.select {|i| i.odd?})
  end
  def even_values(array)
    array.values_at(* array.each_index.select {|i| i.even?})
  end
  def icon_for_type(type)
    {
      "work" => "briefcase",
      "award" => "star",
      "competition" => "hourglass",
      "conference" => "comment",
      "document" => "file",
      "education" => "education",
      "event" => "calendar",
      "holiday" => "globe",
      "learning" => "apple",
      "project" => "console",
      "sport" => "stats",
      "teaching" => "blackboard",
    }[type]
  end
  def ordinalized_date(date, include_year=false)
    date = Date.parse(date.to_s)
    day = date.strftime("%e").strip
    if include_year
      "#{day}#{ordinal(day)} #{date.strftime("%B %Y")}"
    else
      "#{day}#{ordinal(day)} #{date.strftime("%B")}"
    end
  end
  def ordinal(number)
    number = number.to_i
	if (11..13).include?(number % 100)
	  "th"
	else
	  case number % 10
		when 1; "st"
		when 2; "nd"
		when 3; "rd"
		else    "th"
	  end
	end
  end
end

set :css_dir, 'stylesheets'

set :js_dir, 'javascripts'

set :images_dir, 'images'

activate :syntax
set :markdown_engine, :redcarpet
set :markdown, :fenced_code_blocks => true, :smartypants => true

activate :sprockets

set :build_dir, "www"
configure :build do
  activate :minify_css
  activate :minify_javascript
  activate :asset_hash
  activate :gzip
end

after_build do |builder|
  require "open-uri"
  require "json"

  status = open("https://storage.googleapis.com/json-charlieegan3/status.json").read
  JSON.parse(status)

  local_status_file = File.join(config[:build_dir], "status.json")
  File.write(local_status_file, status)
end
