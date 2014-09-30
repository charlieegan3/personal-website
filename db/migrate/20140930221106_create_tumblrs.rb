class CreateTumblrs < ActiveRecord::Migration
  def change
    create_table :tumblrs do |t|
      t.string :url
      t.datetime :created_at
      t.string :text
      t.string :title
    end
  end
end
