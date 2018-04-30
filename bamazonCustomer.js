var inquirer = require("inquirer");
var mysql = require("mysql")

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "b4ca81n!",
    database: "bamazon"
});

var app = {
    initialize: function () {
        app.loadData();
    },
    loadData: function () {
        connection.query("SELECT item_id, product_name, price FROM products", function (err, res) {
            if (err) throw err;
            // console.log(res);
            console.log("ID || Product || Price ($) ||")
            for (var i = 0; i < res.length; i++) {
                var current = "";
                for (key in res[i]) {
                    current += res[i][key];
                    current += " || ";
                }
                console.log("=============================")
                console.log(current)
            }
            console.log("=============================")

        });
    }
}

app.initialize()