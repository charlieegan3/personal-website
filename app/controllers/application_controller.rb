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
      host: request.remote_ip,
      query: request.env['QUERY_STRING']
    ) if user_agent.browser.to_s != 'Typhoeus'

    @images = Image.last(20)
  end

  def impressions
    @impressions = Impression.all.order(created_at: :desc).to_a.uniq {|impression| impression.host }
  end
end
