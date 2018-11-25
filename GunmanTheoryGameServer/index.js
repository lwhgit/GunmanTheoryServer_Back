var net = require("net");
var user = require("./users/user");

var UserManager = user.UserManager;
var AvailableHashManager = user.AvailableHashManager;

var port = 8763;

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
    console.log("Game Server is running on *:%s", port);
    onServerOpened();
});

var userManager = new UserManager();
var hashManager = new AvailableHashManager();

function onServerOpened() {

}

function onSocketAccepted(socket) {
    console.log("A socket accepted. %s:%s", socket.remoteAddress, socket.remotePort);
}

function onSocketError(socket, error) {
    console.log("Socket error. %s", error);
}
function onSocketClosed(socket, hadError) {
    var user = userManager.getUserBySocket(socket);
    if (user) {
        userManager.removeUser(user);
        hashManager.removeHash(user.hash);
        console.log("A user [%s]closed. error: " + hadError, user.hash);
    }
}

function onSocketData(socket, data) {
    var msg = data.toString();
    var cmd = msg.split(" ");

    console.log("Received: " + msg);

    if (cmd[0] == "ask_login_hash_successed" && cmd.length >= 3) {
        hashManager.addHash(cmd[1], cmd[2]);
        console.log("available_hash_added. hash[%s](%s)", cmd[1], cmd[2]);
    } else if (cmd[0] == "login" && cmd.length >= 2) {
        if (hashManager.isHashExists(cmd[1])) {
            userManager.addUser(socket, cmd[1]);
            socket.write("login_successed");
            console.log("login_successed hash[%s]", cmd[1]);
        } else {
            socket.write("login_failed Worng hash.");
            console.log("login_failed Worng hash.");
        }
    }
}
