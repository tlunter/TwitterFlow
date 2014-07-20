/** @jsx React.DOM */

var TwitterList = React.createClass({
  getInitialState: function() {
    return { tweets: [] };
  },
  componentWillMount: function() {
    this.loadTweets();
  },
  loadTweets: function() {
    reqwest({
      url: '/json',
      type: 'json',
      method: 'get',
      success: this.setTweets,
      error: function(err) {
        console.log("Err: " + err);
      }
    });
  },
  setTweets: function(resp) {
    this.setState({ tweets: resp });
    setTimeout(this.loadTweets, 30000);
  },
  renderTweets: function() {
    return this.state.tweets.map(function(t) {
      return <Tweet key={t.id} tweet={t} />
    });
  },
  render: function() {
    if (this.state.tweets.length > 0) {
      return <div>{this.renderTweets()}</div>;
    } else {
      return null;
    }
  }
});
