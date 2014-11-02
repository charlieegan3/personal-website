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
      host: request.remote_ip,
      query: request.env['QUERY_STRING']
    ) if user_agent.browser.to_s != 'Typhoeus'

    @activities = [Tweet.last(15), Post.last(2), Image.last(2)].flatten.sort_by { |e| e.created_at }.reverse
  end

  def impressions
    @impressions = Impression.all.order(created_at: :desc)
  end
end
