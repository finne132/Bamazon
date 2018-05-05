"use strict";

//require dependencies 
var mysql = require("mysql");
var inquirer = require("inquirer");

// create the database connection
var connection = mysql.createConnection({
    host: "127.0.0.1",
    port: 3306,
    user: "root",
    password: "",
    database: "bamazon",
  });

// connect to the database 
connection.connect(function(err) {
  // if there is a database connection error, throw it
    if (err) throw err;
    // query the database for the contents of the products table 
    connection.query("SELECT * FROM products", function (err, result, fields) {
      // if there is an error in the query, throw it 
      if (err) throw err;

      // this is the main content of the "program"
      console.log("Welcome to Bamazon! Made by Joe Finnegan 2018")
      console.log("---ITEMS CURRENTLY FOR SALE ON BAMAZON (TM)---")

      // loop through all of the products in the return from the query 
      // and display them in the console using some basic formatting 
      for (var i = 0; i < result.length; i++)
      {
        console.log(`-ID ${result[i].id}-
        Item: ${result[i].product_name}
        Department: ${result[i].department_name}
        Price: $${result[i].price}
        Quantity Available: ${result[i].stock_quantity}`);
      }
      // call the ask function to prompt the user to pick a product
      // and then enter a quantity. See the ask() function for more info 

      function ask(){
        // use  inquirer to have the user answer the questions in the question array 
        inquirer.prompt(questions).then(answers => {
          // after the user has put in their answers, process them. See processAnswers()
          // function for more information 
          processAnswers(answers);
        })
      };
      
      function processAnswers(answers){
        // this is what happens after the user answers both questions
        console.log("processing answers...");
        console.log("You selected Item ID " + answers.id)
        console.log("You selected quantity " + answers.quantity)
        console.log("This ITEM ID corresponds to " + result[answers.id-1].product_name)
        console.log("This item costs " + result[answers.id-1].price + " per unit and there are " + result[answers.id-1].stock_quantity)
        console.log("The overall price of this order is " + (answers.quantity*result[answers.id-1].price).toFixed(2));
        console.log((result[answers.id-1].stock_quantity - answers.quantity) + " will be the remaining stock after this order is processed")
        if (result[answers.id-1].stock_quantity - answers.quantity >= 0){
        let calculated = result[answers.id-1].stock_quantity - answers.quantity;
        let cID = answers.id;
        updateDB(calculated, cID) 
        }
        else{
          console.log("There is not enough stock to fill this order please try again")
          //connection.end();
        }
        
        connection.end();
      }
      ask();
    });

    function updateDB (calculated, cID){
      connection.query('UPDATE products SET stock_quantity = ' + calculated + ' WHERE id = ' + cID, function (err, res) {
      if (err) throw err;
      console.log(res.affectedRows + " record updated in the database successfully!");
      console.log("Thank you for your order the program is now closing")
      });
    }


    var questions = [
      {
        // question 1 
          message: "Enter the ID of the product you want to purchase",
          type: "input",
          name: "id",
      },
      {
        // question 2 
          message: "How many items would you like to buy?",
          type: "input",
          name: "quantity",
      }
    ];
    
  });

