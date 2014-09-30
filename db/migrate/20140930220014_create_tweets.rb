class CreateTweets < ActiveRecord::Migration
  def change
    create_table :tweets do |t|
      t.string :text
      t.integer :favorites
      t.integer :retweets
      t.string :url
      t.string :hashtags
      t.datetime :created_at
    end
  end
end
