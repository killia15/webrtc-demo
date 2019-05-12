  
  var peerClient;
  var currentPeerConnection;
  var localMediaStream;
    
  var myselfId = document.getElementById('js-myself-id');
  var peerId = document.getElementById('js-peer-id');
  var partnerId = document.getElementById('js-partner-id');
  var open = document.getElementById('js-open');
  var connect = document.getElementById('js-connect');
  var videoMyself = document.querySelector('#js-video-myself');
  var videoPartner = document.querySelector('#js-video-partner');

  navigator.mediaDevices.getUserMedia({video: true, audio: true})
  .then(function(stream) {
    videoMyself.srcObject = stream
    videoMyself.play();
    localMediaStream = stream;
  })

  open.onclick = function(e) {
    // create peer object
    peerClient = new Peer(myselfId.value);

    // if peer connection is opened
    peerClient.on('open', function() {
      peerId.innerText = peerClient.id;
    });
    
    peerClient.on('call', function(call) {
      // answer with my media stream
      call.answer(localMediaStream);
      
      // close current connection if exists
      if (currentPeerConnection) {
        currentPeerConnection.close();
      }
      
      // keep call as currentPeerConnection
      currentPeerConnection = call;
      
      // wait for partner's stream
      call.on('stream', function(stream) {
        videoPartner.srcObject = stream
        videoPartner.play();
      });
      
      // if connection is closed
      call.on('close', function() {
        console.log('Connection is closed.');
      });
    });
    
    // disable id input
    myselfId.setAttribute('disabled', '');
    
    // enable partner id input
    partnerId.removeAttribute('disabled');
    
    // enable connect button
    connect.removeAttribute('disabled');
  };

  connect.onclick = function(e) {
    // if peerClient is not initialized
    if (!peerClient) {
      return;
    }
    
    // connect to partner
    var call = peerClient.call(partnerId.value, localMediaStream);

    // close current connection if exists
    if (currentPeerConnection) {
      currentPeerConnection.close();
    }

    // keep call as currentPeerConnection
    currentPeerConnection = call;

    // wait for partner's stream
    call.on('stream', function(stream) {
      videoPartner.srcObject = stream
      videoPartner.play();
    });

    // if connection is closed
    call.on('close', function() {
      console.log('Connection is closed.');
    });
  };