#!/usr/bin/env ruby

def run(command)
  puts "running: #{command}"
  fail unless system(command)
end

HUGO_RELEASE = "https://github.com/gohugoio/hugo/releases/download/v0.69.2/hugo_0.69.2_Linux-64bit.tar.gz"

# install hugo if missing
unless File.exists?("hugo")
  puts "hugo missing, installing"
  run("curl -L #{HUGO_RELEASE} > hugo.tar.gz")
  run("tar -zxf hugo.tar.gz")
end

# build the site
run("./hugo --environment=production --minify")

# commit the result
email = `git config --global user.email`.chomp
name = `git config --global user.name`.chomp
if name == "" || email == ""
  puts "setting gh actions git identity"
  run('git config --global user.email "githubactions@example.com"')
  run('git config --global user.name "GitHub Actions"')
end
run("git checkout -b netlify")
run("git add public")
run("git -c commit.gpgsign=false commit -m generate-site")
run("git push -f origin netlify")
