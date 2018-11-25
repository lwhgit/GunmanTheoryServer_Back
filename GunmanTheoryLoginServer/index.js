var net = require("net");
var account = require("./accounts/account");

var port = 8762;

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
    console.log("Login Server is running on *:%s", port);
    onServerOpened();
});

var gsSocket = net.connect({
    host: "127.0.0.1",
    port: 8763
}, function() {
    console.log("Connected to Game Server.");
});

gsSocket.on("error", function(error) {
    console.log("Error: " + error);
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

    if (cmd[0] == "register" && cmd.length >= 4) {
        if (accountManager.isIdExists(cmd[1])) {
            socket.write("register_failed This id already exists.");
            console.log("register_failed This id already exists.");
        } else if (accountManager.isNicknameExists(cmd[3])) {
            socket.write("register_failed This nickname already exists.");
            console.log("register_failed This nickname already exists.");
        } else {
            accountManager.register(cmd[1], cmd[2], cmd[3])
            socket.write("register_successed");
            console.log("register_successed");
        }
    } else if (cmd[0] == "ask_login_hash" && cmd.length >= 3) {
        var account = accountManager.login(cmd[1], cmd[2]);
        if (account) {
            var key = account.getKeyHash();
            gsSocket.write("ask_login_hash_successed " + key + " " + account.nickname);
            socket.write("ask_login_hash_successed " + key + " " + account.nickname);
            console.log("ask_login_hash_successed " + key + " " + account.nickname);
        } else {
            socket.write("ask_login_hash_failed This account not exists.");
            console.log("ask_login_hash_failed This account not exists.");
        }
    }
}
