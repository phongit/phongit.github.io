var socket = io.connect('http://172.16.149.10:2009');
moment.locale('vi');
function b64_to_utf8(str) {
    return decodeURIComponent(escape(window.atob(str)));
}

var list_Friends = []

$(document).ready(() => {
    var userName = JSON.parse(b64_to_utf8(sessionStorage.getItem('auth')))[0].userName;
    socket.emit('user-login', userName);
    loadListfriend();
    loadAddFriend();
    loadRecommendFriend();
})

function loadListfriend() {
    $.ajax({
        method: 'POST',
        url: '/contact/listFriends',
        success: (data) => {
            if (data.success) {
                var listFriends = "";
                $.each(data.result, (key, value) => {
                    var obj = {
                        id: value.userName,
                        name: value.hoTen
                    };
                    list_Friends.push(obj);
                    listFriends += `<a onclick="startChat('` + value.userName + `', '` + value.hoTen + `')">
                                    <div class="list-friends">
                                        <div class="div-friend" id="div-friend">
                                            <div class="chat_img"> <img src="https://ptetutorials.com/images/user-profile.png"
                                                    alt="sunil"> </div>
                                            <div class="name-friend">
                                                <h5>`+ value.hoTen + `</h5>
                                                <span id = `+ value.userName + `>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </a>`;
                });
                $('#inbox_chat').html(listFriends);
                $('#recent_heading').html("Danh bạ");
            }
        }
    })
}

function loadAddFriend() {
    $.ajax({
        method: 'POST',
        url: '/contact/listAddFriend',
        success: (data) => {
            if (data.success) {
                var listAddFriend = "";
                $.each(data.result, (key, value) => {
                    listAddFriend += `<div class="newFriend" id="` + value.idBan + `">
                                        <div class="new_chat_img"> <img src="https://ptetutorials.com/images/user-profile.png"
                                                alt="sunil"> </div>
                                        <div class="new_userName"> `+ value.hoTen + `<div>
                                                <button class="btn-add-friend" onclick="denyAddFriend('`+ value.idBan + `')">Từ chối</button>
                                                <button class="btn-add-friend" onclick="acceptAddFriend('`+ value.idBan + `')">Đồng ý</button>
                                            </div>
                                        </div>
                                    </div>`;
                });
                $('#content-newFriend').html(listAddFriend);
            }
        }
    })
}

function loadRecommendFriend() {
    $.ajax({
        method: 'POST',
        url: '/contact/listRecommendFriends',
        success: (data) => {
            if (data.success) {
                var listRecommendFriends = "";
                $.each(data.result, (key, value) => {
                    listRecommendFriends += `<div class="newFriend">
                                                <div class="new_chat_img"> 
                                                    <img src="https://ptetutorials.com/images/user-profile.png" alt="sunil"> 
                                                </div>
                                                <div class="new_userName">`+ value.hoTen + `
                                                    <div id = "div_`+value.userName+`"> 
                                                        <button class="btn-add-friend" onclick="addFriend('`+ value.userName + `')" id="btn_`+value.userName+`">Thêm bạn</button>
                                                    </div>
                                                </div>
                                            </div>`;
                });
                $('#content-recommendFriends').html(listRecommendFriends);
            }
        }
    })
}

function addFriend(userName) {
    $.ajax({
        method: 'POST',
        url: '/contact/addFriends',
        data: {
            userName
        },
        success: (data) => {
            $('#btn_'+userName).remove();
            $('#div_'+userName).append("Đã gửi lời mời")
        }
    })
}

function acceptAddFriend(idBan) {
    $.ajax({
        method: 'POST',
        url: '/contact/acceptAddFriend',
        data: {
            idBan
        },
        success: (data) => {
            $('#' + idBan).remove();
        }
    })
}

function denyAddFriend(idBan) {
    $.ajax({
        method: 'POST',
        url: '/contact/denyAddFriend',
        data: {
            idBan
        },
        success: (data) => {
            $('#' + idBan).remove();
        }
    })
}

socket.on("user-onl", function (data) {
    $.each(data, (key, value) => {
        $('#' + value.name).html(`<span class = "fa fa-circle onl"></span>`)
    })
})

$('#btn-setting').click(() => {
    $('#btn-contact').removeClass("active_icon")
    $('#btn-contact').addClass("icon")
    $('#btn-setting').removeClass("icon")
    $('#btn-setting').addClass("active_icon")
    $('.dropdown-content').css('display', 'block')
})

$('#btn-list-friends').click(() => {
    window.location.replace('/home');
})