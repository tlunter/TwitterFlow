window.onload = function() {
  cast.receiver.logger.setLevelValue(0);
  window.castReceiverManager = cast.receiver.CastReceiverManager.getInstance();

  castReceiverManager.onReady = function(e) {
    console.log("Received ready event: "+JSON.stringify(e.data));
    window.castReceiverManager.setApplicationState("Application status is ready...");
  };

  castReceiverManager.onSenderConnected = function(e) {
    console.log("Received sender connected event: "+e.data);
  };

  castReceiverManager.onSenderDisconnected = function(e) {
    console.log("Received sender disconnected event: "+e.data);
    if (window.castReceiverManager.getSenders().length == 0) {
      window.close();
    }
  };

  castReceiverManager.onSystemVolumeChanged = function(e) {
    console.log('Received System Volume Changed event: ' + e.data['level'] + ' ' +
        e.data['muted']);
  }

  window.messageBus = window.castReceiverManager.getCastMessageBus(
    "urn:x-cast:com.tlunter.twitter-flow"
  );

  window.messageBus.onMessage = function(event) {
    console.log('Message [' + event.senderId + ']: ' + event.data);
    // inform all senders on the CastMessageBus of the incoming message event
    // sender message listener will be invoked
    window.messageBus.send(event.senderId, event.data);
  }

  window.castReceiverManager.start({statusText: "Application is starting"});
  console.log('Receiver Manager started');
}
