class Tweet < ActiveRecord::Base
  def self.last(count)
    all.order(created_at: :desc).take(count)
  end
end
