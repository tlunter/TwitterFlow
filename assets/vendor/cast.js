var applicationID = "";
var namespace = "urn:x-cast:com.tlunter.twitter-flow";
var session = null;

if (!chrome.cast || !chrome.cast.isAvailable) {
  setTimeout(initializeCastApi, 1000);
}

function initializeCastApi() {
  var sessionRequest = new chrome.cast.SessionRequest(applicationID);
  var apiConfig = new chrome.cast.ApiConfig(sessionRequest,
                                            sessionListener,
                                            receiverListener);

  chrome.cast.initialize(apiConfig, onInitSuccess, onError);
}

function onInitSuccess() {
  console.log("onInitSuccess");
}

function onSuccess(message) {
  console.log("Success: "+JSON.stringify(message));
}

function onError(message) {
  console.log("Error: "+JSON.stringify(message));
}

function onStopSuccess() {
  console.log("Stop successful");
}

function sessionListener(e) {
  console.log("New session ID: " + e.sessionId);
  session = e;
  session.addUpdateListener(sessionUpdateListener);
  session.addMessageListener(namespace, receiverMessage);
}

function sessionUpdateListener(isAlive) {
  console.log(isAlive ? "Session updated" : "Session removed");

  if (!isAlive) {
    session = null;
  }
}

function receiverMessage(namespace, message) {
  console.log("Receiver: " + namespace + ", " + message);
}

function receiverListener(e) {
  if (e === 'available') {
    console.log("Receiver found");
  } else {
    console.log("Receivers empty");
  }
}

function stopApp() {
  session.stop(onStopSuccess, onError);
}

function sendMessage(message) {
  if (session != null) {
    session.sendMessage(namespace, message, onSuccess.bind(this, "Sent: " + message), onError);
  } else {
    chrome.cast.requestSession(function(e) {
      session = e;
      session.sendMessage(namespace, message, onSuccess.bind(this, "Sent: " + message), onError);
    }, onError);
  }
}
