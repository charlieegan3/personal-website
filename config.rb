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
      "#{day}#{ordinal(day)} #{date.strftime("%B %y")}"
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
  def anchor_titles(html_content)
    html_content.gsub(/<h.>[^<]+<\/h.>/) do |match|
      slug = match[4..-6].gsub(/\W+/, "_")[0..100]
      "<h2 id=\"#{slug}\"><a href=\"\##{slug}\">#{match[4..-6]}</a></h2>"
    end
  end
end

set :css_dir, 'stylesheets'

set :js_dir, 'javascripts'

set :images_dir, 'images'
ignore "images/icons"

activate :syntax
set :markdown_engine, :redcarpet
set :markdown, :fenced_code_blocks => true, :smartypants => true

activate :sprockets

set :build_dir, "www"
configure :build do
  activate :minify_html
  activate :minify_css
  activate :minify_javascript
  activate :asset_hash
  activate :gzip
end

after_configuration do
  if build?
    puts "Building custom tachyons import"
    used_classes = `find .`.split("\n")
      .select { |file| file.match(/(html|erb)$/) }
      .map { |file| File.read(file).scan(/class(:|=) ?"([\w\s_\-]+)"/) }
      .flatten.join(" ")
      .split(/\s+/).uniq + %w(order-0-ns order-1-ns)

    required_css = File.readlines("source/stylesheets/_tachyons.scss")
      .select { |line|
        line.start_with?("@media") ||
          line == "}\n" ||
          line[0].match(/\[|\w/) ||
          used_classes.any? { |c| line.strip.match(/\.#{c}( |:)/) }
      }.join

    puts "Missing Classes:"
    used_classes.each do |c|
      unless required_css.match(/\.#{c}( |:)/)
        puts c
      end
    end

    `cp source/stylesheets/_tachyons.scss source/stylesheets/_backup_tachyons.scss`
    File.write("source/stylesheets/_tachyons.scss", required_css)
  end
end

after_build do
  puts "Restoring full tachyons list"
  `mv source/stylesheets/_backup_tachyons.scss source/stylesheets/_tachyons.scss`
end

after_build do |builder|
  puts "fetching fallback status.json"

  require "open-uri"
  require "json"

  status = open("https://storage.googleapis.com/json-charlieegan3/status.json").read
  JSON.parse(status)

  local_status_file = File.join(config[:build_dir], "status.json")
  File.write(local_status_file, status)
end

after_build do |builder|
  puts "placing site icons"
  raise unless `cp ./source/images/icons/* ./www` == ""
  raise unless `cp ./www/blog/feed.rss ./www` == ""
end

after_build do |builder|
  puts "validating HTML"

  HTMLProofer::Utils.class_eval do
        def clean_content(string)
          string = string.encode(Encoding.find("US-ASCII"), { invalid: :replace, undef: :replace, replace: "" })
          string.gsub(%r{https?://([^>]+)}i) do |url|
          url.gsub(/&(?!amp;)/, "&amp;")
         end
        end
  end

  HTMLProofer.check_directory(
        "./www",
        {
      verbose: true,
      parallel: { in_processes: 3 },
      check_html: true,
      check_favicon: true,
      disable_external: true,
      url_ignore: [/^\#$/],
      error_sort: :desc
        }
  ).run
end
