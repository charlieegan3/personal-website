from ruby:2.4

WORKDIR /app

COPY Gemfile .
COPY Gemfile.lock .

RUN bundle install

COPY . .

ENV LC_ALL=C.UTF-8
ENV LANG=en_US.UTF-8
ENV LANGUAGE=en_US.UTF-8

CMD middleman build
