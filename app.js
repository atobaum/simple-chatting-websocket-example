var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var http = require("http");
var webSocketServer = require("websocket").server;

var app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

var connections = [];
var server = http.createServer(app);
var wsServer = new webSocketServer({
  httpServer: server,
});

wsServer.on("request", (req) => {
  // chatting 프로토콜을 받는다.
  var connection = req.accept("chatting");

  connections.push(connection);
  console.log(new Date() + " Connection accepted. Now " + connections.length);

  connection.on("message", (message) => {
    if (message.type === "utf8")
      // 브로드캐스팅
      connections.forEach((c) => c.send(message.utf8Data));
  });

  connection.on("close", () => {
    connections = connections.filter((c) => c != connection);
    console.log(
      new Date() + " Connection disconnected. Now " + connections.length
    );
  });
});

server.listen(3000, () => {
  console.log("Express start to listen port 3000");
});

module.exports = app;
