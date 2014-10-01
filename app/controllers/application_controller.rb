class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception

  def index
    @activities = [Image.all,Post.all,Tweet.all].flatten.
      sort_by { |e| e.created_at }.
      reverse.shuffle.in_groups_of(3, false)
  end
end
