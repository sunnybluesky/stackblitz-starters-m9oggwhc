// run `node index.js` in the terminal

console.log(`Hello Node.js v${process.versions.node}!`);

const express = require('express');
const http = require('http');

const app = express();
const server = http.Server(app);

const socketIo = require('socket.io');

const io = socketIo(server);
const PORT = 3000;

console.log(__dirname);

// ルーティングの設定。'/' にリクエストがあった場合 src/index.html を返す
app.use(express.static(__dirname + '/public'));
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});
app.all('*', (req, res) => {
  res.sendFile(__dirname + '/404.html');
});

// 3000番ポートでHTTPサーバーを起動
server.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});

// クライアントとのコネクションが確立したら'connected'という表示させる
io.on('connection', (socket) => {
  console.log(`connected id:${socket.id}`);
});
