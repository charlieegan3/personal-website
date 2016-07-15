require 'nokogiri'

Dir.glob("*.html.erb") do |file|
  puts file
  content = File.open(file).read.split("---\n")
  front_matter, html = content[1], content[2]

  doc = Nokogiri::HTML(html)

  doc.css("*").children.each do |span|
    span.attributes.each do |attr|
      next if %w(target href).include? attr.first
      span.remove_attribute(attr.first)
    end
  end

  root = doc.at_css("body").children.size == 2 ? "p" : "body"

  output = ""
  doc.at_css(root).children.each do |child|
    if child.text.strip == ""
      output += "\n"
    elsif %w(div span).include? child.name
      output += "<p>#{child.inner_html}</p>\n"
    else
      output += child.to_s
    end
  end

  output.gsub!(/<\/?span>/, "")
  output.gsub!(/<br\/?>/, "")

  output.gsub!("<i>", "<em>")
  output.gsub!("</i>", "</em>")
  output.gsub!("<b>", "<strong>")
  output.gsub!("</b>", "</strong>")

  output = output.split("\n").map do |line|
    line.strip.match(/^</) ? line : "<p>#{line}</p>"
  end.reject { |l| l == "<p></p>" }.join("\n")

  html = output.gsub(/\n{2,}/, "\n\n").strip

  File.open(file, "w").write("---\n#{front_matter}---\n#{html}")
end
