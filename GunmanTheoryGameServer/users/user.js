function UserManager() {
    this.userList = new Array();

    this.addUser = function(socket, hash) {
        this.userList.push(new User(socket, hash.hash, hash.nickname));
    };

    this.removeUser = function(user) {
        this.userList.splice(this.userList.indexOf(user), 1);
    };

    this.getUserBySocket = function(socket) {
        for (var i = 0;i < this.userList.length;i ++) {
            var user = this.userList[i];
            if (user.socket == socket) {
                return user;
            }
        }
    };

    this.getUserByHash = function(hash) {
        for (var i = 0;i < this.userList.length;i ++) {
            var user = this.userList[i];
            if (user.hash == hash) {
                return user;
            }
        }
    };
}

function AvailableHashManager() {               // 네이밍 다시해야할 것 같음
    this.hashList = new Array();

    this.addHash = function(hash, nickname) {
        this.hashList.push({
            hash: hash,
            nickname: nickname
        });
    };

    this.removeHash = function(hash) {
        for (var i = 0;i < this.hashList.length;i ++) {
            if (this.hashList.hash == hash) {
                this.hashList.splice(i, 1);
            }
        }
    };

    this.isHashExists = function(hash) {
        for (var i = 0;i < this.hashList.length;i ++) {
            if (this.hashList[i].hash == hash) {
                return true;
            }
        }

        return false;
    };
}

function User(socket, hash) {
    this.socket = socket;
    this.hash = hash;

    this.send = function(msg) {
        this.socket.write(msg);
    };
}

exports.UserManager = UserManager;
exports.AvailableHashManager = AvailableHashManager;
