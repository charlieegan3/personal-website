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
end

set :css_dir, 'stylesheets'

set :js_dir, 'javascripts'

set :images_dir, 'images'

activate :syntax
set :markdown_engine, :redcarpet
set :markdown, :fenced_code_blocks => true, :smartypants => true

set :build_dir, "www"
configure :build do
  activate :minify_css
  activate :minify_javascript
  activate :asset_hash
  activate :gzip
end
