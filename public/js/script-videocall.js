function b64_to_utf8(str) {
    return decodeURIComponent(escape(window.atob(str)));
}
var userName = JSON.parse(b64_to_utf8(sessionStorage.getItem('auth')))[0].userName;

// function getPeer() {
//     const id = uid(10);
//     $('#txtMySignal').val(id)
//     return id;
// }

// const peerID = getPeer();
var checkCall = document.getElementById('checkcall').value;
var nguoiNhan = document.getElementById('userName').value;

const connecttion = {
    host: 'peerjssever.herokuapp.com',
    port: 443,
    secure: true,
    key: 'peerjs'
};

const peer = new Peer(connecttion);


peer.on('open', (id) => {
    var peerID = id;
    socket.emit('user-login', {userName, peerID});
    var peerID = id;
    if (checkCall == 0) {
        socket.emit('star-videocall',{nguoiNhan, peerID});
    }
    if (checkCall == 1) {
        socket.emit('videocall', { nguoiNhan, userName });
    }
    // socket.emit('NGUOI_DUNG_DANG_KY', { ten: username, peerId: id });
});

// socket.emit('NEW_PEER_ID', peerID);

socket.on('server-star-videocall', (data) => {
    console.log(data)
    var peerID = data.peerID
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
})
peer.on('call', (call) => {
    console.log("   ádasdas")
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


