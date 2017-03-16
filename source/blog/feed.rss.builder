xml.instruct! :xml, :version => '1.0'
xml.rss :version => "2.0" do
  xml.channel do
    xml.title "charlieegan.com/blog"
    xml.description "Charlie Egan's Peronal Blog"
    xml.link "http://charlieegan3.com/blog"

    page_articles(blog_name = 'blog').each do |post|
      xml.item do
        xml.title post.title
        xml.description post.body
        xml.pubDate post.date
        xml.guid "https://charlieegan3.com#{post.url}"
      end
    end
  end
end
