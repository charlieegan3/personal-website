class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception

  def index
    @activities = [Image.all.last(3).reverse,Post.all,Tweet.all].flatten.shuffle.sort_by { |e| e.created_at }.reverse.take(15)
  end
end
