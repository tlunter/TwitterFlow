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
  property :full_text, String, :length => 255
  property :created_at, DateTime

  belongs_to :user
end
