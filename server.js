var http = require("http");
var socketio = require("socket.io");
var fs = require("fs");

var port = process.env.VMC_APP_PORT || 3000;
var server = http.createServer(function(req, res) {
    res.writeHead(200, {
        "Content-Type": "text/html"
    });
    var output = fs.readFileSync("./index.html", "utf-8", function (err, data) {
            if(err){
                res.writeHead(404, {'Content-Type': 'text/plain'});
                res.write('Not Found');
                return res.end();
            }
        }
    );
    res.end(output);
}).listen(port);

var io = socketio.listen(server);

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
