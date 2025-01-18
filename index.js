// run `node index.js` in the terminal
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
const disconnectedSocketIdList = []

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
    this.joinRoom("PUBLIC_CHAT")
  }
  login(){
    this.lastLogined = new Date()
  }
  join(id){
    this.loginedSocketId.push(id)
  }
  joinRoom(room){
    this.rooms.push(room)
  }
  leaveRoom(room){
    this.rooms.splice(this.rooms.indexOf(room),1)
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
  bootingProcess()//起動処理
});

// クライアントとのコネクションが確立したら'connected'という表示させる
io.on('connection', (socket) => {
  socketIdList.push(socket.id)
  console.log(`connected id:${socket.id}`);
  io.to(socket.id).emit("confirm-connection")

  socket.on("disconnect",()=>{
    disconnectedSocketIdList.push(socket.id)
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
        findUser(username).loginedSocketId.push(socket.id)
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
  socket.on("send-message",(data)=>{
    sendMessage(data.roomId,data.user,data.message)
    console.log(`New message:${data.message}`)
    var m = getMessages(data.roomId,1)
    var obj = {
      room:data.roomId,
      content:m,
    }
    updateMessageToMenber(data.roomId,obj)
  })
  socket.on("req-message",(data)=>{
    // data= {room,length}
    var m = getMessages(data.room,data.len)
    var obj = {
      room:data.room,
      content:m,
    }
    io.to(socket.id).emit("res-message",obj)
  })
});
function updateMessageToMenber(room,data){
  const idList = []
  for(var i=0;i<=userList.length-1;i++){
    if(userList[i].rooms.includes(room)){
      var arr = userList[i].loginedSocketId
      for(var j=0;j<=arr.length-1;j++){
        idList.push(arr[j])
      }
    }
  }
  for(var i=0;i<=idList.length-1;i++){
    io.to(idList[i]).emit("res-message",{
      content:data,
      room:room,
    })
  }
}

setInterval(()=>{
  for(var i=0;i<=disconnectedSocketIdList.length-1;i++){
    if(socketIdList.includes(disconnectedSocketIdList[i])){
      var id = disconnectedSocketIdList[i]
      var index = socketIdList.indexOf(id)
      socketIdPlaceList.splice(index,1)
      socketIdList.splice(index,1)
    }
  }
  io.emit("res-place-data",[socketIdList,socketIdPlaceList])
},1000/fps)

class Message {
  constructor(sender, message, timestamp) {
    this.sender = sender;
    this.message = message;
    this.timestamp = timestamp || new Date();
  }
}

class Room {
  constructor(id, name) {
    this.id = id;
    this.name = name;
    this.messages = [];
  }

  addMessage(message) {
    this.messages.push(message);
  }
}

// 全てのルームを管理するオブジェクト
const rooms = {};

// 新しいルームを作成する関数
function createRoom(id, name) {
  rooms[id] = new Room(id, name);
}

// メッセージを送信する関数
function sendMessage(roomId, sender, message) {
  const room = rooms[roomId];
  if (room) {
    room.addMessage(new Message(sender, message));
  } else {
    console.error(`Room ${roomId} not found`);
  }
}

// 特定のルームのメッセージを取得する関数
function getMessages(roomId,len=true) {
  const room = rooms[roomId];
  if(len === true && room){
    len = room.messages.length
  }
  let arr = []
  if(room){
    var temp = room.messages
    for(var i=0;i<=(temp.length-len)-1;i++){
      temp[i] = null
    }
    arr = temp
  }
  return arr;
}

function bootingProcess(){
  createRoom("PUBLIC_CHAT","ぜんたいちゃっと！")
}