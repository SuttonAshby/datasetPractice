CREATE DATABASE bamazon;

USE bamazon;

-- Create the table actors.
CREATE TABLE products (
  item_id INTEGER NOT NULL AUTO_INCREMENT,
  product_name varchar(50) NOT NULL,
  department_name varchar(50),
  price varchar(50) NOT NULL,
  stock_quantity varchar(50) NOT NULL,
  PRIMARY KEY(item_id)
);

INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES("Cat", "Pets", 25, 30), ("Dog", "Pets", 50, 20), ("Snake", "Pets", 75, 5), ("Roses", "Plants", 10, 20),
("Azaleas", "Plants", 12, 30), ("Camellia", "Plants", 11, 15), ("Geode", "Rocks", 5, 60), ("Pyrite", "Rocks", 8, 55), 
("Quartz", "Rocks", 7, 70), ("Hovercraft", "Vehicles", 150, 5);
