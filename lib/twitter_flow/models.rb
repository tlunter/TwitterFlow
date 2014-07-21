require 'data_mapper'

class TwitterFlow::User
  include DataMapper::Resource

  property :id, Serial
  property :name, String
  property :screen_name, String

  has n, :tweets
end

class TwitterFlow::Tweet
  include DataMapper::Resource

  property :id, Serial
  property :twitter_id, Integer, min: 0, max: 2**64-1, unique: true
  property :full_text, String, :length => 255
  property :created_at, DateTime

  belongs_to :user
end
