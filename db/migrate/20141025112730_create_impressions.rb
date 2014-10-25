class CreateImpressions < ActiveRecord::Migration
  def change
    create_table :impressions do |t|
      t.string :browser
      t.string :version
      t.string :platform
      t.string :referrer
      t.string :path
      t.string :language
      t.string :host
      t.string :query

      t.timestamps
    end
  end
end
