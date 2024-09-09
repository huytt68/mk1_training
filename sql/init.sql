CREATE DATABASE IF NOT EXISTS huy_app;

USE huy_app;

CREATE TABLE IF NOT EXISTS products (
  id INTEGER AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  amount INTEGER NOT NULL);

INSERT INTO products (name, price, amount) 
VALUES
('Product A', 20000, 20),
('Product B', 30000, 30);