/** @jsx React.DOM */
var Tweet = React.createClass({
  render: function() {
    var date = new Date(this.props.tweet.created_at);
    return (
      <div className="tweet">
        <div className="header">
          <span className="name">{this.props.tweet.user.name}</span>
          <span className="screen_name">@{this.props.tweet.user.screen_name}</span>
          <span className="date">{date.toLocaleString()}</span>
        </div>
        <div className="full-text">{this.props.tweet.full_text}</div>
      </div>
    );
  }
});
