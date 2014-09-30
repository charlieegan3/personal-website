class CreateInstagrams < ActiveRecord::Migration
  def change
    create_table :instagrams do |t|
      t.string :url
      t.string :image_url
      t.string :large_image_url
      t.string :tags
      t.integer :likes
      t.string :filter

      t.timestamps
    end
  end
end
