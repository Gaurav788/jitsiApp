let options;
let roomName;
let token;
let isConnected;
const CONSTANTS = {
  MUTE_ALL_AUDIO: 'muteAllAudio',
  MUTE: 'mute'
}
var goButtonEle,
  muteAllRemoteAudioButtonEle,
  disconnectButton;

function buildOptions(tenant, roomName = 1) {
  return {
    connection: {
      hosts: {
        domain: '8x8.vc',
        muc: `conference.${tenant}.8x8.vc`,
        focus: 'focus.8x8.vc'
      },
      serviceUrl: `wss://8x8.vc/xmpp-websocket?room=${roomName}`,
      clientNode: 'http://jitsi.org/jitsimeet'
    },
    conference: {
      p2p: {
        enabled: true
      }
    }
  };
}

let connection = null;
let isJoined = false;
let room = null;

let localTracks = [];
const remoteTracks = {};
let muteAll = false



function onLocalTracks(tracks) {
  localTracks = tracks;
  for (let i = 0; i < localTracks.length; i++) {
    if (localTracks[i].getType() === 'video') {
      $('body').append(`<video style='margin-right:20px;' autoplay='1' width='500' height='auto' id='localVideo${i}' />`);
      localTracks[i].attach($(`#localVideo${i}`)[0]);
    } else {
      $('body').append(
        `<audio autoplay='1' muted='true' id='localAudio${i}' />`);
      localTracks[i].attach($(`#localAudio${i}`)[0]);
    }
    if (isJoined) {
      room.addTrack(localTracks[i]);
    }
  }
}


function onRemoteTrack(track) {
  console.log('on remote track')
  const participant = track.getParticipantId();

  if (!remoteTracks[participant]) {
    remoteTracks[participant] = [];
  }
  const idx = remoteTracks[participant].push(track);
  const id = participant + track.getType() + idx;

  if (track.getType() === 'video') {
    $('body').append(
      `<video style='margin-right:20px;' autoplay='1' width='500' height='auto' id='${participant}video${idx}' />`);
  } else {
    $('body').append(
      `<audio autoplay='1' id='${participant}audio${idx}' />`);
  }
  track.attach($(`#${id}`)[0]);
}


function onConferenceJoined() {
  console.log('conference joined!');
  isJoined = true;
  for (let i = 0; i < localTracks.length; i++) {
    room.addTrack(localTracks[i]);
  }
}


function onUserLeft(id) {
  console.log('user left');
  if (!remoteTracks[id]) {
    return;
  }
  const tracks = remoteTracks[id];

  for (let i = 0; i < tracks.length; i++) {
    tracks[i].detach($(`#${id}${tracks[i].getType()}`));
  }
}


function onConnectionSuccess() {
  isConnected = true
  muteAllRemoteAudioButtonEle && muteAllRemoteAudioButtonEle.show()
  disconnectButton && disconnectButton.show()

  JitsiMeetJS.createLocalTracks({ devices: ['audio', 'video'] })
    .then(onLocalTracks)
    .catch(error => {
      throw error;
    });

  room = connection.initJitsiConference(roomName, options.conference);
  room.on(
    JitsiMeetJS.events.conference.TRACK_ADDED,
    track => {
      !track.isLocal() && onRemoteTrack(track);
    });
  room.on(
    JitsiMeetJS.events.conference.CONFERENCE_JOINED,
    onConferenceJoined);
  room.on(
    JitsiMeetJS.events.conference.USER_JOINED,
    id => {
      console.log(`user joined: id`);
    });
  room.on(
    JitsiMeetJS.events.conference.USER_LEFT,
    onUserLeft);

  room.on(JitsiMeetJS.events.conference.PARTICIPANT_PROPERTY_CHANGED, function (e) {
    console.log('PARTICIPANT_PROPERTY_CHANGED', e)
    let muteAllAudioProp = e.getProperty(CONSTANTS.MUTE_ALL_AUDIO)

    if (muteAllAudioProp) { muteAllLocalAudioTrack(muteAllAudioProp) }
    // if
  })

  room.setLocal
  room.join();
}


function onConnectionFailed() {
  isConnected = false
  muteAllRemoteAudioButtonEle && muteAllRemoteAudioButtonEle.hide()
  disconnectButton && disconnectButton.hide()

  console.error('Connection Failed!');
}


function onDisconnect() {
  isConnected = false
  muteAllRemoteAudioButtonEle && muteAllRemoteAudioButtonEle.hide()
  disconnectButton && disconnectButton.hide()

  console.log('disconnect!');
  connection.removeEventListener(
    JitsiMeetJS.events.connection.CONNECTION_ESTABLISHED,
    onConnectionSuccess);
  connection.removeEventListener(
    JitsiMeetJS.events.connection.CONNECTION_FAILED,
    onConnectionFailed);
  connection.removeEventListener(
    JitsiMeetJS.events.connection.CONNECTION_DISCONNECTED,
    onDisconnect);
}


// Close all resources when closing the page.
function disconnect() {
  for (let i = 0; i < localTracks.length; i++) {
    localTracks[i].dispose();
  }
  if (room) {
    room.leave();
  }
  if (connection) {
    connection.disconnect();
  }
}

function muteAllLocalAudioTrack(muteAll) {
  if (!localTracks || !localTracks.length) {
    console.log('No local tracks Found')
    return
  }

  // let videoTracks = localTracks.filter(track => track.getType() === 'video')//,
  //     tracksPromise = videoTracks && new Promise.all(videoTracks.map(t => t.mute())) || null
  let audioTracks = localTracks.filter(track => track.getType() === 'audio')
  
  if (!audioTracks) {
    console.log('No audio tracks found')
    return
  }

  audioTracks && audioTracks.map(t => muteAll == 'true' ? t.mute() : t.unmute())

}

// function muteAudioFrom


$(window).bind('beforeunload', disconnect);
$(window).bind('unload', disconnect);


$(document).ready(function () {
  goButtonEle = $("#goButton"),
  muteAllRemoteAudioButtonEle = $('#muteAllRemoteAudioBtn'),
  disconnectButton = $("#disconnectBtn")

  JitsiMeetJS.init();


  goButtonEle.click(function () {
    const tenant = $("#tenantInput").val();
    roomName = $("#roomInput").val();
    token = $("#tokenInput").val();
    options = buildOptions(tenant, roomName);

    connection = new JitsiMeetJS.JitsiConnection(null, token, options.connection);

    connection.addEventListener(
      JitsiMeetJS.events.connection.CONNECTION_ESTABLISHED,
      onConnectionSuccess);
    connection.addEventListener(
      JitsiMeetJS.events.connection.CONNECTION_FAILED,
      onConnectionFailed);
    connection.addEventListener(
      JitsiMeetJS.events.connection.CONNECTION_DISCONNECTED,
      onDisconnect);

    connection.connect();

  });

  muteAllRemoteAudioButtonEle.click(function () {
    if (isConnected) {

      muteAll = !muteAll
      room.setLocalParticipantProperty(CONSTANTS.MUTE_ALL_AUDIO, `${muteAll}`)
    }

    console.log('button clicked')
  })

  disconnectButton.click(function() {
    if(!isConnected) {
      console.log('Already Disconnected')
      return
    }

    disconnect()
  })

});
