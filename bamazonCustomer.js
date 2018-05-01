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
            app.ask()

        });
    },
    ask: function(){
        inquirer.prompt([{
            type: "input",
            message: "What is the ID of the item you wish to purchase?",
            name: "item"
        },{
            type: "input",
            message: "What quantity do you wish to purchase?",
            name: "quantity"
        }]).then(function(inquirerResponse){
            connection.query("SELECT stock_quantity FROM products WHERE ?",{item_id: inquirerResponse.item}, function (err, res) {
                if (err) throw err;
                // console.log(res);
                if(inquirerResponse.quantity > res[0].stock_quantity){
                    console.log("Sorry there is insufficent supply in stock")
                    console.log("You will now be redirected to the home page")
                    app.initialize()
                } else {
                    var updatedQuantity = parseInt(res[0].stock_quantity - inquirerResponse.quantity)
                    connection.query("UPDATE products SET ? WHERE ?",[{stock_quantity: updatedQuantity},{item_id: inquirerResponse.item}], function (err, res) {
                        if (err) throw err;
                        // console.log(res);
                        console.log()
            
                    });
                }
            });

        })
    }

}

app.initialize()