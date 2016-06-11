FROM ruby:latest

WORKDIR /app
ADD . /app

RUN apt-get update && apt-get install -y nodejs
RUN gem install bundler
RUN bundle install

CMD middleman server
