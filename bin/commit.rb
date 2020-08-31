#!/usr/bin/env ruby

def run(command)
  puts "running: #{command}"
  fail unless system(command)
end

version_string = File.read("version_string").strip rescue ""

if ARGV.length < 1  && version_string == ""
  fail "need commit message as arg"
end

if version_string == ""
  version_string = ARGV[0]
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
run("git commit --allow-empty -m '#{version_string}'")
run("git push origin master")
