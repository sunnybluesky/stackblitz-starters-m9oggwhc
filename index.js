// run `node index.js` in the terminal

console.log(`Hello Node.js v${process.versions.node}!`);

const express = require('express');
const http = require('http');

const app = express();
const server = http.Server(app);

const socketIo = require('socket.io');

const io = socketIo(server);
const PORT = 3000;

const allUserNameList = []
console.log(__dirname);

const socketIdList = []
const socketIdPlaceList = []

const fps = 60;

class user{
  name = ""
  password = ""
  rooms = []
  loginedSocketId = []
  lastLogined = null
  constructor(name,password){
    this.lastLogined = new Date()
    allUserNameList.push(name)
    this.name = name
    this.password = password
    userList.push(this)
  }
  login(){
    this.lastLogined = new Date()
  }
  join(id){
    this.loginedSocketId.push(id)
  }
  leave(id){
    var index = this.loginedSocketId.indexOf(id)
    if(index != -1){
    this.loginedSocketId.splice(index,1)
  }
}
}
const userList = []
function findUser(name){
  for(var i=0;i<=userList.length-1;i++){
    if(userList[i].name == name){
      return userList[i]
    }
  }
}

// ルーティングの設定。'/' にリクエストがあった場合 src/index.html を返す
app.use(express.static(__dirname + '/public'));
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});
app.all('*', (req, res) => {
  res.sendFile(__dirname + '/public/404.html');
});

// 3000番ポートでHTTPサーバーを起動
server.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});

// クライアントとのコネクションが確立したら'connected'という表示させる
io.on('connection', (socket) => {
  socketIdList.push(socket.id)
  console.log(`connected id:${socket.id}`);
  io.to(socket.id).emit("confirm-connection")

  socket.on("disconnect",()=>{
    socketIdList.splice(socketIdList.indexOf(socket.id),1)
    socketIdPlaceList[socketIdList.indexOf(socket.id)] = null
  })
  socket.on("req-signup",(data)=>{
    const username = data[0]
    const password = data[1]
    const isVaildUserName = allUserNameList.includes(username)
    if(isVaildUserName){
      //名前が重複
      io.to(socket.id).emit("res-signup",[false,"duplicate-name"])
    }else{
      //ログイン成功
    console.log(username,password,socket.id)
    userList.push(new user(username,password))
    io.to(socket.id).emit("res-signup",[true,"success",username,password])
  }
  });
  socket.on("req-login",(data)=>{
    const username = data[0]
    const reqestedPassword = data[1]

    var isFound = allUserNameList.includes(username)
    if(isFound){
      const password = findUser(username).password
      if(password == reqestedPassword){
        io.to(socket.id).emit("res-login",[true,"success",findUser(username)])
      }else{
        io.to(socket.id).emit("res-login",[false,"password-invalid"])
      }
    }else{
      io.to(socket.id).emit("res-login",[false,"user-not-found"])
    }
  })
  socket.on("send-place-chara",(data)=>{
    socketIdPlaceList[socketIdList.indexOf(socket.id)] = data
  })
});

setInterval(()=>{
  io.emit("res-place-data",[socketIdList,socketIdPlaceList])
} ,1000/fps)