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
        inquirer.prompt([{
            type: "list",
            message: "What would you like to do?",
            choices: ["View Products", "View Low Inventory", "Add to Inventory", "Add New Product", "Exit"],
            name: "initial"
        }]).then(function (inquirerResponse) {
            if (inquirerResponse.initial === "View Products") {
                app.view();
            } else if (inquirerResponse.initial === "View Low Inventory") {
                app.low();
            } else if (inquirerResponse.initial === "Add to Inventory") {
                app.addInv();
            } else if (inquirerResponse.initial === "Add New Product") {
                app.addProduct()
            } else if (inquirerResponse.initial === "Exit") {
                connection.end()
                console.log("===============================================");
                console.log("                  Goodbye!!");
                console.log("===============================================");
            }
        })
    },
    againPrompt: function () {
        inquirer.prompt([{
            type: "list",
            message: "Would you like to do something else?",
            choices: ["Yes", "No"],
            name: "again"
        }]).then(function (inquirerResponse) {
            if (inquirerResponse.again === "Yes") {
                app.initialize()
            } else {
                connection.end()
                console.log("===============================================");
                console.log("                  Goodbye!!");
                console.log("===============================================");
            }
        });
    },
    view: function () {
        connection.query("SELECT * FROM products", function (err, res) {
            if (err) throw err;
            // console.log(res);
            console.log("ID || Product || Dept. || Price ($) || Stock ||")
            for (var i = 0; i < res.length; i++) {
                var current = "";
                for (key in res[i]) {
                    current += res[i][key];
                    current += "  ||  ";
                }
                console.log("===============================================");
                console.log(current);
            }
            console.log("===============================================");
            console.log("")
            console.log("")
        });
        app.againPrompt()
    },
    low: function () {
        connection.query("SELECT * FROM products WHERE stock_quantity < 5", function (err, res) {
            if (err) throw err;
            // console.log(res);
            console.log("ID || Product || Dept. || Price ($) || Stock ||")
            for (var i = 0; i < res.length; i++) {
                var current = "";
                for (key in res[i]) {
                    current += res[i][key];
                    current += "  ||  ";
                }
                console.log("===============================================");
                console.log(current);
            }
            console.log("===============================================");
            console.log("")
            console.log("")
        });
        app.againPrompt()
    },
    addInv: function () {
        inquirer.prompt([{
            type: "input",
            message: "What is the ID of the item you wish to update?",
            name: "item"
        }, {
            type: "input",
            message: "What quantity to be added?",
            name: "quantity"
        }]).then(function (inquirerResponse) {
            connection.query("SELECT stock_quantity FROM products WHERE ?", { item_id: inquirerResponse.item }, function (err, res) {
                if (err) throw err;
                // console.log(res);
                var updatedQuantity = parseInt(res[0].stock_quantity) + parseInt(inquirerResponse.quantity)
                connection.query("UPDATE products SET ? WHERE ?", [{ stock_quantity: updatedQuantity }, { item_id: inquirerResponse.item }], function (err, res2) {
                    if (err) throw err;
                    // console.log(res);
                    console.log("Product ID: " + inquirerResponse.item + " stock updated to " + updatedQuantity)
                    console.log("")
                    console.log("")
                    app.againPrompt()
                });
            });
        });
    },
    addProduct: function () {
        inquirer.prompt([{
            type: "input",
            message: "Name of New Product:",
            name: "name"
        }, {
            type: "input",
            message: "Department of New Product:",
            name: "department"
        }, {
            type: "input",
            message: "Price of New Product:",
            name: "price"
        }, {
            type: "input",
            message: "Stock Quantity of New Product:",
            name: "stock"
        }]).then(function (inquirerResponse) {
            connection.query("INSERT INTO products SET ?",
                {
                    product_name: inquirerResponse.name,
                    department_name: inquirerResponse.department,
                    price: inquirerResponse.price,
                    stock_quantity: inquirerResponse.stock
                },
                function (err, res) {
                    console.log(inquirerResponse.name + " added");
                    console.log("")
                    console.log("")
                    app.againPrompt()
                }
            );
        })
    }
}


app.initialize()