var fs = require("fs");
var crypto = require("crypto");

function AccountManager() {
    this.path = "./accounts/accountlist.json";
    this.accountList = new Array();

    this.init = function() {
        if (!fs.existsSync(this.path)) {
            fs.writeFileSync(this.path, "[]", "utf8");
        }

        var tmpList = JSON.parse(fs.readFileSync(this.path).toString());
        for (var i = 0;i < tmpList.length;i ++) {
            var tmp = tmpList[i];
            this.accountList.push(new Account(tmp.id, tmp.hash, tmp.nickname));
        }
    };

    this.getJSON = function() {
        return JSON.stringify(this.accountList, null, "    ");
    };

    this.isIdExists = function(id) {
        for (var i = 0;i < this.accountList.length;i ++) {
            if (this.accountList[i].id == id) {
                return true;
            }
        }
        return false;
    };

    this.isNicknameExists = function(nickname) {
        for (var i = 0;i < this.accountList.length;i ++) {
            if (this.accountList[i].nickname == nickname) {
                return true;
            }
        }
        return false;
    };

    this.login = function(id, hash) {
        for (var i = 0;i < this.accountList.length;i ++) {
            if (this.accountList[i].id == id && this.accountList[i].hash == hash) {
                return this.accountList[i];
            }
        }
        return null;
    };

    this.register = function(id, hash, nickname) {
        this.accountList.push(new Account(id, hash, nickname));
        fs.writeFileSync(this.path, this.getJSON(), "utf8");
    };
}

function Account(id, hash, nickname) {
    this.id = id;
    this.hash = hash;
    this.nickname = nickname;

    this.getKeyHash = function() {
        var key = this.id + " " + this.hash + " " + (new Date().getTime());
        var hash = crypto.createHash("sha256").update(key).digest("hex");
        return hash;
    };
}

exports.AccountManager = AccountManager;
