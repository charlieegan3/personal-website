require 'slim'
Slim::Engine.disable_option_validator!

###
# Blog settings
###

activate :blog do |blog|
  blog.name = "timeline"
  blog.prefix = "timeline"
end

activate :blog do |blog|
  blog.name = "articles"
  blog.prefix = "articles"
end

activate :blog do |blog|
  blog.name = "blog"
  blog.prefix = "blog"
  blog.layout = "post"

  # blog.permalink = "{year}/{month}/{day}/{title}.html"
  # blog.sources = "{year}-{month}-{day}-{title}.html"
  # blog.taglink = "tags/{tag}.html"
  # blog.summary_separator = /(READMORE)/
  # blog.summary_length = 250
  # blog.year_link = "{year}.html"
  # blog.month_link = "{year}/{month}.html"
  # blog.day_link = "{year}/{month}/{day}.html"
  # blog.default_extension = ".markdown"
  # blog.paginate = true
  # blog.per_page = 10
  # blog.page_link = "page/{num}"
end

###
# Compass
###

# Change Compass configuration
# compass_config do |config|
#   config.output_style = :compact
# end

###
# Page options, layouts, aliases and proxies
###

# Per-page layout changes:
#
# With no layout
# page "/path/to/file.html", layout: false
#
# With alternative layout
# page "/path/to/file.html", layout: :otherlayout
#
# A path which all have the same layout
# with_layout :admin do
#   page "/admin/*"
# end

# Proxy pages (http://middlemanapp.com/basics/dynamic-pages/)
# proxy "/this-page-has-no-template.html", "/template-file.html", locals: {
#  which_fake_page: "Rendering a fake page with a local variable" }

###
# Helpers
###

# Automatic image dimensions on image_tag helper
# activate :automatic_image_sizes

# Reload the browser automatically whenever files change
# activate :livereload

# Methods defined in the helpers block are available in templates
helpers do
  def odd_values(array)
    array.values_at(* array.each_index.select {|i| i.odd?})
  end
  def even_values(array)
    array.values_at(* array.each_index.select {|i| i.even?})
  end
end

set :css_dir, 'stylesheets'

set :js_dir, 'javascripts'

set :images_dir, 'images'

activate :syntax
set :markdown_engine, :redcarpet
set :markdown, :fenced_code_blocks => true, :smartypants => true

# Build-specific configuration
configure :build do
  # For example, change the Compass output style for deployment
  # activate :minify_css

  # Minify Javascript on build
  # activate :minify_javascript

  # Enable cache buster
  # activate :asset_hash

  # Use relative URLs
  # activate :relative_assets

  # Or use a different image path
  set :http_prefix, "/new/"
end

activate :deploy do |deploy|
  deploy.method = :git
  deploy.remote = "git@github.com:charlieegan3/new.git"
end
