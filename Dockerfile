FROM ruby:latest

WORKDIR /app
ADD . /app

RUN mkdir -p /root/.ssh
ADD id_rsa /root/.ssh/id_rsa
RUN chmod 700 /root/.ssh/id_rsa
RUN echo "Host github.com\n\tStrictHostKeyChecking no\n" >> /root/.ssh/config

ADD .gitconfig /root/.gitconfig

RUN apt-get update && apt-get install -y nodejs
RUN gem install bundler
RUN bundle install

CMD middleman server
