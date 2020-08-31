#!/usr/bin/env ruby

require "uri"
require "net/http"
require "json"

PAGE = "ec45bc32-7cf8-4a94-a49c-6c326c3a82aa"
BLOCK = "e2ec815a-ee37-4662-98b0-fb393819cf26"

url = URI("https://www.notion.so/api/v3/loadPageChunk")

https = Net::HTTP.new(url.host, url.port);
https.use_ssl = true

request = Net::HTTP::Post.new(url)
request["Content-Type"] = "application/json"
request.body = JSON.generate(
  {
    "pageId": PAGE,
    "limit": 50,
    "cursor": {
      "stack": [
        [
          {
            "table": "block",
            "id": BLOCK,
          }
        ]
      ]
    },
    "chunkNumber": 0,
    "verticalColumns": false
  }
)


response = https.request(request)
unless response.code != 200
  fail "failed to get version #{response.code} #{response.body}"
end

data = JSON.parse(response.body)
if data["errorId"]
  fail "failed to get version #{data["name"]} #{data["message"]}"
end

version_string =
  data.dig("recordMap", "block", BLOCK, "value", "properties", "title", 0, 0)

unless version_string
  fail "missing version string in response data #{data}"
end

previous_versions = `git log --format='%s'`.split("\n")

if previous_versions.empty?
  fail "no old versions found"
end

puts previous_versions

if previous_versions.include? version_string
  puts "version '#{version_string}' is present"
  exit 1
end

File.write("version_string", version_string)
