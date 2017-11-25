---
title: "Does the gender of a film's director relate to a film's box-office success?"
date: 2017-11-25 22:23:02 +0000
---

Last weekend I was on the sidelines of a discussion about the difference in
return on investment for films directed by women.

The idea was that films directed by women made more money - it had come from
this [TED talk](https://www.ted.com/talks/naomi_mcdougall_jones_what_it_s_like_to_be_a_woman_in_hollywood).

> Furthermore, my colleagues and I commissioned a study looking at the average
> return on investment across 1,700 films in the last 5 years, if a man or a
> woman was the: director, screenwriter, producer, lead actor. And in every
> single category, the film made more money if that role was filled by a woman.

See the footnote explaining more about their study [here](https://www.ted.com/talks/naomi_mcdougall_jones_what_it_s_like_to_be_a_woman_in_hollywood/footnotes).

I thought this sounded ambiguous. If that role (singular) was filled by a
woman... - I'm assuming it means any of those roles. This is unfortunate as it's
very hard for me to get this data - screenwriter and producer a bit fluffy to
extract automatically.

I thought it was an interesting question though - what if films made my women
were better performing?

---

So what can we do...

I saw the study was commissioned by the-numbers.com and started there. I quickly
saw they maintained a [list of top grossing films](http://www.the-numbers.com/movie/budgets/all).
I also worked out that I could find the film's director on
[wikidata](https://www.wikidata.org/wiki/Wikidata:Main_Page).

So with this in mind, I set out to download the data I needed to best replicate
the study referenced in the talk using 'significant films directed by women'.

**1. Getting the budget-grossing data**

This script will download all the-numbers.com budget data. It loops over the
pages and creates a CSV of the raw data.

```ruby
require "open-uri"
require "csv"
require "nokogiri"
require "pry"

csv_string = CSV.generate do |csv|
  # this is the max number of pages with data on the-numbers.com
  (1..5401).step(100).each do |page|
    puts page
    doc = Nokogiri::HTML(open("http://www.the-numbers.com/movie/budgets/all/#{page}").read)
    rows = doc.css("tr:not(:first-child)")
    rows.each do |row|
      csv << row.children.map(&:text).reject { |e| e == "\n" }
    end
  end
end

File.write("films.csv", csv_string)
```

It creates [this file](https://gist.github.com/charlieegan3/8c2f0c702c554656bfa112b7ae8f2457#file-films-csv).

**2. Getting the director gender**

This is more tricky, it involves using the Wikipedia search to disambiguate the
titles and match them to Wikidata entities.

```ruby
require "nokogiri"
require "reality"
require "open-uri"
require "pry"

include Reality

def wikipedia_lookup(film, year)
  query = URI.escape("#{film} #{year}")
  url = "https://en.wikipedia.org/w/index.php?search=#{query}&title=Special:Search&profile=default&fulltext=1&searchToken=4eic3ybnnptwcaolvqkzevt5q"
  pages = Nokogiri::HTML(open(url).read).css(".mw-search-result-heading a").map(&:text)

  pages.take(5).each do |page|
    page = Entity(page)
    return page if !page.nil? && !page.directors.nil?
  end

  nil
end

index = -1
CSV.read("films.csv").reject(&:empty?).each do |_, date, film, budget, domestic, world_wide|
  index += 1
  # next if index < 18 # use this to start at a given index

  puts [index, film].join("\t")
  year = date.split("/").last

  if year.to_i > 2017 || [domestic, world_wide].uniq == ["$0"]
    next
  end

  film_page = wikipedia_lookup(film, year) rescue nil

  row = [date, film, budget, domestic, world_wide]

  if film_page.nil?
    puts "ERROR 1"
    puts row = CSV.generate_line(row + [nil, nil])

    open("films_and_directors.csv", "a") { |f| f << row }
  else
    begin
      directors = film_page.directors
      names = directors.map(&:name)
      genders = directors.map(&:sex)

      puts row = CSV.generate_line(row + [names.join(","), genders.join(",")])

      open("films_and_directors.csv", "a") { |f| f << row }
    rescue
      puts "ERROR 2"
      puts row = CSV.generate_line(row + [nil, nil])

      open("films_and_directors.csv", "a") { |f| f << row }
    end
  end
end
```

It creates [this file](https://gist.github.com/charlieegan3/8c2f0c702c554656bfa112b7ae8f2457#file-films_and_directors-csv).

**3. Formatting the data**

All that took some time to download, each film is multiple requests to Wikipedia
and I ran them all in serial because it's easier and more polite...

I had some formatting and excluding of data that I wanted to do as a final
processing step after the download had completed. Todo:

* Remove films with multiple directors
* Remove films that had failed to lookup the director gender
* Format budgets and gross figures as numbers

```ruby
require "csv"
require "pry"


def parse_figure(figure)
  Integer(figure.gsub(/[^\d]/, ""))
end

CSV.open("films_and_directors_formatted.csv", "wb") do |csv|
  CSV.read("films_and_directors.csv").each do |date, title, budget, domestic, worldwide, directors, genders|
    next if directors.nil? || genders.nil?
    next if directors.include?(",") || genders.include?(",")

    csv << [
      title,
      date,
      directors,
      parse_figure(budget),
      parse_figure(domestic),
      parse_figure(worldwide),
      genders
    ]
  end
end
```

It creates [this file](https://gist.github.com/charlieegan3/8c2f0c702c554656bfa112b7ae8f2457#file-films_and_directors_formatted-csv).

**4. Some basic analysis**

Despite downloading 5,444 films, only 241 were solely female directed. In my
dataset I found that films directed by female directors had a lower ROI.
Comparing domestic (US) gross income vs. budget; female directed films made an
mean 1.68x return. Male directed films made over a 4x return on films paired
with female directed films by equal budget (closest within 5%). This included
data from ~2700 male-directed films over a 100 repeated tests.

All my scripts and data are [here](https://gist.github.com/charlieegan3/8c2f0c702c554656bfa112b7ae8f2457#file-films_and_directors_formatted-csv).

---

I'd like to have the budget stats for other types of films. I wonder if the top
5000 films by gross return is really a good sample - I can think of many more
balanced film samples - only they'd be harder to gather data on. All I've looked
at here are Blockbusters and they're only one type of film.
