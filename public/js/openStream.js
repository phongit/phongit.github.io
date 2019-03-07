function openStream(cb) {
    navigator.mediaDevices.getUserMedia({ audio: true, video: true })
        .then(stream => {
            cb(stream);
        })
        .catch(err => console.log(err));
}