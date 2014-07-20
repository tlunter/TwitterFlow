require 'data_mapper'
require 'twitter'
require 'twitter_flow'

DataMapper.setup(:default, 'mysql://twitter_flow:twitter_flow@localhost/twitter_flow')

client = Twitter::REST::Client.new do |config|
  config.consumer_key        = ""
  config.consumer_secret     = ""
  config.access_token        = ""
  config.access_token_secret = ""
end

tf = TwitterFlow::Server.new(client)

run tf
