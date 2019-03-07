document.getElementById('changepsw').onclick = () => {
    var matkhau = document.getElementById('matkhau').value;
    var newmatkhau = document.getElementById('newmatkhau').value;
    var nhaplaimk = document.getElementById('nhaplaimk').value;
    if (newmatkhau === nhaplaimk) {
        $.ajax({
            method: 'POST',
            url: '/changepsw/changepsw',
            data: {
                matkhau,
                newmatkhau
            },
            success: (data) => {
                if (data.success) {
                    alert("Đã đổi")
                }
            }
        })
    }
}