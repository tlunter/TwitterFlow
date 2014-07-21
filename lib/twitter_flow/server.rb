require 'sinatra'
require 'sinatra/json'

class TwitterFlow::Server < Sinatra::Base
  attr_reader :twitter

  helpers do
    def reload_tweets_for(_)
      begin
        last_tweet = TwitterFlow::Tweet.max(:twitter_id).to_i

        opts = { count: 200 }
        opts[:since_id] = last_tweet unless last_tweet.zero?

        twitter.home_timeline(opts).each do |tweet|
          unless u = TwitterFlow::User.first(name: tweet.user.name)
            u = TwitterFlow::User.new
            u.name = tweet.user.name
            u.screen_name = tweet.user.screen_name
            u.save
          end

          t = TwitterFlow::Tweet.new
          t.twitter_id = tweet.id
          t.full_text = strip_emoji(tweet.full_text.dup)
          t.created_at = tweet.created_at
          t.user = u
          t.save
        end
      rescue Twitter::Error::TooManyRequests => ex
        puts ex.message
        puts "Resetting in: #{ex.rate_limit.reset_in}"
      end
    end

    def strip_emoji(str)
      str = str.force_encoding('utf-8').encode
      clean_text = ""

      # emoticons  1F601 - 1F64F
      regex = /[\u{1f600}-\u{1f64f}]/
      clean_text = str.gsub regex, ''

      #dingbats 2702 - 27B0
      regex = /[\u{2702}-\u{27b0}]/
      clean_text = clean_text.gsub regex, ''

      # transport/map symbols
      regex = /[\u{1f680}-\u{1f6ff}]/
      clean_text = clean_text.gsub regex, ''

      # enclosed chars  24C2 - 1F251
      regex = /[\u{24C2}-\u{1F251}]/
      clean_text = clean_text.gsub regex, ''

      # symbols & pics
      regex = /[\u{1f300}-\u{1f5ff}]/
      clean_text = clean_text.gsub regex, ''
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

  get %r{/receiver} do
    erb :receiver
  end

  get '/' do
    erb :index
  end
end
