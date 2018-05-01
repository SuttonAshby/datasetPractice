var inquirer = require("inquirer");
var mysql = require("mysql")
var dotenv = require('dotenv').config()

var connection = mysql.createConnection({
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    host: "localhost",
    port: 3306,
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
            app.ask()

        });
    },
    ask: function () {
        inquirer.prompt([{
            type: "input",
            message: "What is the ID of the item you wish to purchase?",
            name: "item"
        }, {
            type: "input",
            message: "What quantity do you wish to purchase?",
            name: "quantity"
        }]).then(function (inquirerResponse) {
            connection.query("SELECT stock_quantity, price FROM products WHERE ?", { item_id: inquirerResponse.item }, function (err, res) {
                if (err) throw err;
                // console.log(res);
                var requested = parseInt(inquirerResponse.quantity)
                var stock = parseInt(res[0].stock_quantity)
                if (requested > stock) {
                    console.log("Sorry there is insufficent supply in stock")
                    console.log("You will now be redirected to the home page")
                    app.initialize()

                } else {
                    var updatedQuantity = parseInt(res[0].stock_quantity) - parseInt(inquirerResponse.quantity)
                    connection.query("UPDATE products SET ? WHERE ?", [{ stock_quantity: updatedQuantity }, { item_id: inquirerResponse.item }], function (err, res2) {
                        if (err) throw err;
                        // console.log(res);
                        console.log("Your purchase will be $" + (inquirerResponse.quantity * res[0].price))
                        app.againPrompt()
                    });
                }
            });

        })
    },
    againPrompt: function () {
        inquirer.prompt([{
            type: "list",
            message: "Would you like to buy something else?",
            choices: ["Yes", "No"],
            name: "again"
        }]).then(function (inquirerResponse) {
            if (inquirerResponse.again === "Yes") {
                app.initialize()
            } else {
                connection.end()
                console.log("=============================")
                console.log("          Goodbye!!");
                console.log("=============================")
            }
        });
    }
}

app.initialize()