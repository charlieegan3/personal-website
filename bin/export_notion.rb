#!/usr/bin/env ruby

require "uri"
require "net/http"
require "json"
require "down"

# Start the export
url = URI("https://www.notion.so/api/v3/enqueueTask")

https = Net::HTTP.new(url.host, url.port);
https.use_ssl = true

request = Net::HTTP::Post.new(url)
request["Content-Type"] = "application/json"
request["Cookie"] = ENV.fetch("NOTION_COOKIE")

data = {
  "task": {
    "eventName": "exportBlock",
    "request": {
      # Website index block
      "blockId": "f48cc7f4-175d-4e55-a1f0-bb0ced8f914a",
      "recursive": true,
      "exportOptions": {
        "exportType": "markdown",
        "timeZone": "Europe/London",
        "locale": "en"
      }
    }
  }
}

request.body = JSON.pretty_generate(data)

response = https.request(request)

unless response.kind_of? Net::HTTPSuccess
  fail "request failed #{response.body}"
end

response = JSON.parse(response.body)

task_id = response["taskId"]

# Wait for export

count = 0
export_url = nil
loop do
  url = URI("https://www.notion.so/api/v3/getTasks")
  request = Net::HTTP::Post.new(url)
  request["Content-Type"] = "application/json"
  request["Cookie"] = ENV.fetch("NOTION_COOKIE")
  data = {
    "taskIds": [ task_id ]
  }
  request.body = JSON.pretty_generate(data)
  response = https.request(request)
  unless response.kind_of? Net::HTTPSuccess
    fail "request failed #{response.body}"
  end

  response = JSON.parse(response.body)

  puts "pages done: " + response["results"][0].dig("status", "pagesExported").to_s

  export_url = response["results"][0].dig("status", "exportURL")
  break if export_url

  count += 1
  if count > 60
    fail "took to long to waiting for export"
  end

  sleep 1
end

# Download the file
puts export_url
retry_count = 0
loop do
  begin
    Down.download(export_url, destination: "./export.zip")
    break
  rescue Exception => e
    puts e.message

    retry_count += 1

    if retry_count > 5
      fail "Failed to download archive"
    end

    sleep retry_count * 5
  end
end
