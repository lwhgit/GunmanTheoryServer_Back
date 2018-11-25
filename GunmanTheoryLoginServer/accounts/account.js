var fs = require("fs");

function AccountManager() {
    this.path = "./accounts/accountlist.json";
    this.accountList = new Array();

    this.init = function() {
        if (!fs.existsSync(this.path)) {
            fs.writeFileSync(this.path, "[]", "utf8");
        }

        this.accountList = JSON.parse(fs.readFileSync(this.path).toString());
    };

    this.getJSON = function() {
        return JSON.stringify(this.accountList, null, "    ");
    };

    this.isExists = function(id) {
        for (var i = 0;i < this.accountList.length;i ++) {
            if (this.accountList[i].id == id) {
                return true;
            }
        }
        return false;
    };

    this.login = function(id, hash, nickname) {
        for (var i = 0;i < this.accountList.length;i ++) {
            if (this.accountList[i].id == id && this.accountList[i].hash == hash) {
                return this.accountList[i];
            }
        }
        return null;
    };

    this.register = function(id, hash) {
        this.accountList.push(new Account(id, hash));
        fs.writeFileSync(this.path, this.getJSON(), "utf8");
    };
}

function Account(id, hash) {
    this.id = id;
    this.hash = hash;

    this.getKey = function() {
        return "as"
    };
}

exports.AccountManager = AccountManager;
