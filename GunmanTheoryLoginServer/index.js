var net = require("net");
var account = require("./accounts/account");

var port = 8763;

var AccountManager = account.AccountManager;

var server = net.createServer(function(socket) {
    onSocketAccepted(socket);

    socket.on("error", function(error) {
        onSocketError(socket, error);
    }).on("close", function(hadError) {
        onSocketClosed(socket, hadError);
    }).on("data", function(data) {
        onSocketData(socket, data);
    });
});

server.listen(port, function() {
    console.log("Server is running on *:%s", port);
    onServerOpened();
});

var accountManager = new AccountManager();

function onServerOpened() {
    accountManager.init();
}

function onSocketAccepted(socket) {
    console.log("A socket accepted. %s:%s", socket.remoteAddress, socket.remotePort);
}

function onSocketError(socket, error) {
    console.log("Socket error. %s", error);
}
function onSocketClosed(socket, hadError) {
    console.log("A socket closed. error: " + hadError);
}

function onSocketData(socket, data) {
    var msg = data.toString();
    var cmd = msg.split(" ");

    console.log("Received: " + msg);

    if (cmd[0] == "register" && cmd.length >= 3) {
        if (accountManager.isExists(cmd[1])) {
            socket.write("register_failed This id already exists.")
        } else {
            accountManager.register(cmd[1], cmd[2])
            socket.write("register_successed");
        }
    } else if (cmd[0] == "login" && cmd.length >= 4) {
        
    }
}
