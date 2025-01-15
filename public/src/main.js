console.log('loaded main.js');
let screenMode = "place"
let isShowLoginForm = true

let socketIdList = []
let placeList = []


const flg = {
  load: {
    count: 0,
    needed: 3,
    whole: false,
    connection: false,
    font: false,
    login:false,
  }
}
const responseTime = {
  s: 0,
  e: 0,
  elapsed: 0,
  start: function () {
    this.s = new Date()
  },
  stop: function () {
    this.e = new Date()
    this.elapsed = this.e.getTime() - this.s.getTime();
    return this.elapsed
  },
}
let user = null;
function checkLogined() {
  cookie.refreshCookie();
  console.log(cookie.obj);
  if (v == cookie.obj.loggedIn) {
    cookie.setCookie('loggedIn', false, cookie.defaultExpires);
  } else {
    var v = JSON.parse(cookie.obj.loggedIn);
  }
  return cookie.obj.loggedIn
}

socket = io();
responseTime.start()

const isLoggedIn = checkLogined();

socket.on('confirm-connection', function () {
  var time = (responseTime.stop())
  console.log('接続が確認されました');
  console.log(`応答時間:${time}ms`)
  flg.load.connection = true
  flg.load.count++
});
socket.on("res-signup", function (data) {
  console.log(data)
  if (data[0]) {
    //サインアップに成功
    socket.emit("req-login", [data[2], data[3]])
  }
})
socket.on("res-login", function (data) {
  console.log(data)
  if (data[0]) {
    //ログインに成功
    user = data[2]
    cookie.setCookie("loggedIn", "true")
    cookie.setCookie("username", user.name)
    cookie.setCookie("password", user.password)
    cookie.refreshCookie()
    elements.login.loginSuccessMessage.textContent = "まもなくログインが完了します..."
    updateLoginFailedMessage("")
    setTimeout(() => {
      if(isShowLoginForm){
      location.reload()
      }
    }, 300)
    flg.load.login = true
    flg.load.count++
  } else {
    //ログインに失敗
    if(eval(cookie.obj.loggedIn)){
      cookie.setCookie("loggedIn", "false")
      location.reload()
    }
    switch (data[1]) {
      case "user-not-found":
        updateLoginFailedMessage("ユーザーが見つかりませんでした。");
        break;
      case "password-invalid":
        updateLoginFailedMessage("パスワードまたはユーザー名が一致しません。")
        break;
      default:
        updateLoginFailedMessage("不明のエラーです。");
        break;
    }
  }
})

function requestLogin(username, password) {
  socket.emit("req-login", [username, password])
}
function requestSignUp(username, password) {
  socket.emit("req-signup", [username, password])
}

document.fonts.ready.then(function () {
  flg.load.font = true
  flg.load.count++
});

socket.on("res-place-data",(data)=>{
  socketIdList = data[0]
  placeList = data[1]
})