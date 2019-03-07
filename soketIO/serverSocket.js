arrPeerID = [];
var arrSocketID = [];
module.exports = function (io) {
    io.on('connection', socket => {
        function findByName(name, arr) {
            var id;
            arr.forEach((e) => {
                if (e.name === name) {
                    id = e.id;
                }
            })
            return id;
        }
        // function findByPeerID(peerID, arr) {
        //     var id;
        //     arr.forEach((e) => {
        //         if (e.peerID === peerID) {
        //             id = e.id;
        //         }
        //     })
        //     return id;
        // }
        // function findByid(id, arr) {
        //     var name;
        //     arr.forEach((e) => {
        //         if (e.id === id) {
        //             name = e.name;
        //         }
        //     })
        //     return name;
        // }

        socket.on("user-login", function (data) {
            if(arrSocketID.findIndex(x => x.name == data)>0){
                arrSocketID = arrSocketID.map(element => {
                    element[`id`] = socket.id;
                    element[`peerID`] = data.peerID;
                    return element;
                });
            }else{
                var obj = {
                    name: data.userName,
                    id: socket.id,
                    peerID: data.peerID
                }
                arrSocketID.push(obj);
            }
            socket.username = data;
            io.sockets.emit("user-onl", arrSocketID);
        })

        // socket.emit('ONLINE_PEER_ARRAY', arrPeerID);

        // socket.on('NEW_PEER_ID', peerID => {
        //     socket.peerID = peerID;
        //     arrPeerID.push(peerID);
        //     io.emit('NEW_CLIENT_CONNECT', peerID);
        // });

        // socket.on('disconnect', () => {
        //     const index = arrPeerID.indexOf(socket.peerID);
        //     arrPeerID.splice(index, 1);
        //     io.emit('SOMEONE_DISCONNECTED', socket.peerID);
        // });

        socket.on("user-send-chat", function (data) {
            socket.to(findByName(data.nguoiNhan, arrSocketID)).emit('server-send-chat', data);
        })
        socket.on("videocall", function (data) {
            socket.to(findByName(data.nguoiNhan, arrSocketID)).emit('server-videocall', data);
        })
        socket.on('star-videocall', (data)=>{
            socket.to(findByName(data.nguoiNhan, arrSocketID)).emit('server-star-videocall', data);
        })
    });

}