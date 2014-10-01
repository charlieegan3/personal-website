# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20140930221106) do

  create_table "instagrams", force: true do |t|
    t.string   "url"
    t.string   "image_url"
    t.string   "large_image_url"
    t.string   "tags"
    t.integer  "likes"
    t.string   "filter"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "posts", force: true do |t|
    t.string   "url"
    t.datetime "created_at"
    t.string   "text"
    t.string   "title"
  end

  create_table "tweets", force: true do |t|
    t.string   "text"
    t.integer  "favorites"
    t.integer  "retweets"
    t.string   "url"
    t.string   "hashtags"
    t.datetime "created_at"
  end

end
