var modal = document.getElementById('myModal');
var btn = document.getElementById("myBtn");
var btnClose = document.getElementById("btnClose");
var span = document.getElementsByClassName("close")[0];

const openStream = require('./openStream');
const playVideo = require('./playVideo');
const closeStream = require('./closeStream');
// var Peer = require('peerjs');
const uid = require('uid');
const $ = require('jquery');
const io = require('socket.io-client');
var localStream;
var FriendStream;

span.onclick = function () {
    modal.style.display = "none";
};

btnClose.onclick = function () {
    window.existingCall.close();
}

const socket = io('https://server2009.herokuapp.com');

function getPeer() {
    const id = uid(10);
    $('#txtMySignal').val(id)
    return id;
}

const peerID = getPeer();
socket.emit('NEW_PEER_ID', peerID);

const connecttion = {
    host: 'peerjssever.herokuapp.com',
    port: 443,
    secure: true,
    key: 'peerjs'
};

const peer = new Peer(peerID, connecttion);

btn.onclick = function () {
    var peerID = $('#peer-id').html();
    modal.style.display = "block";
    var x = window.outerWidth;
    if (x > 780) {
        document.getElementById("LocalVideo").style.right = ((x - 780) / 2) + "px"
    }
    openStream(stream => {
        playVideo(stream, 'LocalStream');
        const call = peer.call(peerID, stream);
        call.on('stream', remoteStream => playVideo(remoteStream, 'FriendStream'));
        window.existingCall = call;
        localStream = stream;
        call.on('close', () => {
            localStream.getVideoTracks()[0].stop();
            localStream.getAudioTracks()[0].stop();
        })
    });
}
peer.on('call', (call) => {
    modal.style.display = "block";
    var x = window.outerWidth;
    if (x > 780) {
        document.getElementById("LocalVideo").style.right = ((x - 780) / 2) + "px"
    }
    openStream(stream => {
        playVideo(stream, 'LocalStream');
        call.answer(stream);
        call.on('stream', remoteStream => playVideo(remoteStream, 'FriendStream'));
        window.existingCall = call;
        FriendStream = stream;
    });
    call.on('close', () => {
        FriendStream.getVideoTracks()[0].stop();
        FriendStream.getAudioTracks()[0].stop();
    })
});

$('#ulPeerID').on('click', 'li', function () {
    const peerID = $(this).text();
    $('#peer-id').html(peerID);
});

socket.on('ONLINE_PEER_ARRAY', arrPeerID => {
    arrPeerID.forEach(id => {
        $('#ulPeerID').append(`<li id="${id}">${id}</li>`);
    });
});


socket.on('SOMEONE_DISCONNECTED', peerID => {
    $(`#${peerID}`).remove();
});


socket.on('NEW_CLIENT_CONNECT', id => $('#ulPeerID').append(`<li id="${id}">${id}</li>`));