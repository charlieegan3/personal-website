class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception

  def index
    user_agent = UserAgent.parse(request.env['HTTP_USER_AGENT'])

    Impression.create(
      browser: user_agent.browser.to_s,
      version: user_agent.version.to_s,
      platform: user_agent.platform.to_s,
      referrer: request.referrer,
      path: request.env['REQUEST_PATH'],
      language: request.env['HTTP_ACCEPT_LANG'],
      host: request.env['REMOTE_HOST'],
      query: request.env['QUERY_STRING']
    ) if user_agent.browser.to_s != 'Typhoeus'

    @activities = [Tweet.all.take(30), Post.all.take(2), Image.all.take(2)].flatten.sort_by { |e| e.created_at }.reverse.take(30)

  end

  def impressions
    @impressions = Impression.all.reverse
  end
end
