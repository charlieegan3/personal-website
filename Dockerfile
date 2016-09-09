FROM ruby:latest

WORKDIR /app
ADD . /app

RUN apt-get update && apt-get install -y nodejs
RUN gem install bundler
RUN bundle install

# used in adhoc script
RUN gem install metainspector

CMD middleman server
