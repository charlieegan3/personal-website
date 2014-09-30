require 'twitter'
require 'tumblr_client'
require 'instagram'

require 'pry'


#twitter_client = Twitter::REST::Client.new do |config|
#  config.consumer_key        = "uUPrwYbvn5pFitG8rJ6RCYmC8"
#  config.consumer_secret     = "3YpDfYLuk7w71t7EMsCHhWTlZhzfFOoYeQm0QfXytrN3drP0ZU"
#end
#
#tweets = twitter_client.user_timeline("charlieegan3")
#tweets.select! { |tweet| tweet.media? == false }
#tweets.select! { |tweet| tweet.retweet? == false }
#tweets.select! { |tweet| tweet.reply? == false }

Tumblr.configure do |config|
  config.consumer_key = "ykjTrM6bdrlg4sjkhWZG7gUE41ulrTB2vO89FeibrF0qK8W4Ov"
  config.consumer_secret = "M1CnlrlnY5tSBQWf96MLSeTHYOEF5QLBd7ReP1TSgo1YL9VyDl"
end

client = Tumblr::Client.new

posts = client.posts('charlieegan3')['posts']
posts.select! { |post| post['type'] == 'text' }
posts.select! { |post| post['state'] == 'published' }


#Instagram.configure do |config|
#  config.client_id = "08dbb71e050f4394ba6332a0c4fb818a"
#  config.client_secret = "e7b5a4f64b874418b93b2f2f3613ac81"
#end
#
#client = Instagram.client(access_token: '302526752.08dbb71.7ff1b4363f9a4389b50e4ab108f32738')
#images = client.user_recent_media


binding.pry


