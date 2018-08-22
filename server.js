'use strict';
const express = require('express');
const app = express();
const http = require("http").Server(app);
const fs = require("fs");
//const serveIndex = require('serve-index');

const ROOT_PATH = './';
const PORT = process.env.VMC_APP_PORT || 3000;

app.use(express.static(ROOT_PATH, { index: "index.html" }));
/*app.use(serveIndex(ROOT_PATH, {
    icons: true,
    view: "details"
}));*/
const server = app.listen(PORT, () => {
  console.log(`express server *:${PORT}`);
});

const io = require("socket.io")(server);

io.sockets.on("connection", function(socket) {
    console.log("connection from", socket.id);

    // html 側
    // ロボットの作成
    socket.on("createRobot", function(data) {

        console.log("createRobot from", socket.id);
        console.log(data);
        data.socketId = socket.id;
        io.sockets.emit("CreateRobot", data);
    });

    // Board 側
    socket.on("SetNowPanel", function(data) {
        io.to(data.robotId).emit("onChangeNowPanel", data);
        console.log("SetNowPanel from", socket.id);
        console.log(data);
    });
    socket.on("SetNowLife", function(data) {
        io.to(data.robotId).emit("onChangeNowLife", data)
        console.log("SetNowLife from", socket.id);
            console.log(data);
    });

    // 切断したときに送信
    socket.on("disconnect", function() {
        console.log("disconnect from", socket.id);
        io.sockets.emit("DisconnectRobot", {socketId: socket.id});
    });
});
