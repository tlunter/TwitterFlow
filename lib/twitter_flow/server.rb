require 'sinatra'
require 'sinatra/json'

class TwitterFlow::Server < Sinatra::Base
  attr_reader :twitter

  helpers do
    def reload_tweets_for(_)
      begin
        twitter.home_timeline.each do |tweet|
          unless TwitterFlow::Tweet.first(created_at: tweet.created_at)
            unless u = TwitterFlow::User.first(name: tweet.user.name)
              u = TwitterFlow::User.new
              u.name = tweet.user.name
              u.screen_name = tweet.user.screen_name
              u.save
            end

            t = TwitterFlow::Tweet.new
            t.full_text = tweet.full_text
            t.created_at = tweet.created_at
            t.user = u
            t.save
          end
        end
      rescue Twitter::Error::TooManyRequests => ex
        puts ex.message
      end
    end
  end

  def initialize(client, *args)
    super(*args)
    @twitter = client
  end

  def set_client(client)
    @twitter = client
  end

  get '/json' do
    headers "Content-Type" => "application/json"

    reload_tweets_for(nil)

    TwitterFlow::Tweet.all(order: [:created_at.desc]).to_json(relationships: { user: {} })
  end

  get '/receiver' do
    erb :receiver
  end

  get '/' do
    erb :index
  end
end
