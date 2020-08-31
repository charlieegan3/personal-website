#!/usr/bin/env ruby

def run(command)
  puts "running: #{command}"
  fail unless system(command)
end

if ARGV.length < 1
  fail "missing version name as first arg"
end

detail = ""
if ARGV.length == 2
  detail = ARGV[1]
end

# configure git if needed
email = `git config --global user.email`.chomp
name = `git config --global user.name`.chomp
if name == "" || email == ""
  puts "setting gh actions git identity"
  run('git config --global user.email "githubactions@example.com"')
  run('git config --global user.name "GitHub Actions"')
end

# commit the content changes
run("git add content")
run("git commit -m '#{ARGV[0]}' -m '#{detail}'")
run("git push origin master")
