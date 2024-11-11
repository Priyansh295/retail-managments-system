-- DDL Commands

-- Show existing databases
SHOW DATABASES;

-- Drop the database if it exists
DROP DATABASE IF EXISTS Inventory_DB;

-- Creating Database Inventory_DB
CREATE DATABASE IF NOT EXISTS Inventory_DB;
USE Inventory_DB;

-- -----------------------------------------------------------------------------------------------------------------
-- CREATE STATEMENTS
-- -----------------------------------------------------------------------------------------------------------------

-- CREATE TABLE Client
CREATE TABLE Client(
   Client_ID VARCHAR(5),                -- Unique identifier for clients
   Client_Name VARCHAR(20) NOT NULL,    -- Client's name (not null)
   Email TEXT NOT NULL,                 -- Client's email (not null)
   phone_no DECIMAL(13, 0) NOT NULL,    -- Client's phone number (not null)
   City VARCHAR(20),                    -- Client's city
   PINCODE DECIMAL(6, 0),               -- Client's PIN code
   Building TEXT,                       -- Client's building
   Floor_no INT,                        -- Client's floor number
   Password_client TEXT,                -- Client's password
   PRIMARY KEY(Client_ID)               -- Primary key is Client_ID
);

-- CREATE TABLE Orders
CREATE TABLE Orders(
   Order_ID VARCHAR(100),               -- Unique identifier for orders
   Client_ID VARCHAR(5),                -- Client associated with the order
   Total_Payment DECIMAL(10, 2),        -- Total payment for the order
   Shipment_Date timestamp,             -- Shipment date
   Order_Placement_Date timestamp default
   current_timestamp,                   -- Order placement date with default value
   Employee_ID VARCHAR(5),              -- Employee associated with the order
   Status ENUM("In Progress", "Shipped",
    "Complete", "Cancelled"),           -- Order status
   PRIMARY KEY(Order_ID)                -- Primary key is Order_ID
);

-- CREATE TABLE Order_Line
CREATE TABLE Order_Line(
   Order_ID VARCHAR(100),               -- Order associated with the line
   Product_ID VARCHAR(5),               -- Product associated with the line
   Status ENUM("In progress", "Done"),  -- Status of the order line
   Quantity INT,                        -- Quantity of the product in the order line
   PRIMARY KEY(Order_ID, Product_ID)    -- Composite primary key
);

-- CREATE TABLE Product
CREATE TABLE Product(
   Product_ID VARCHAR(5),               -- Unique identifier for products
   Product_Name TEXT,                   -- Name of the product
   Product_Description TEXT,            -- Description of the product
   Category VARCHAR(10),                -- Category of the product
   Price Decimal(10, 2),                -- Price of the product
   Image TEXT,                          -- Image URL of the product
   Assembling_time INT,                 -- Time required for assembling the product
   PRIMARY KEY (Product_ID)             -- Primary key is Product_ID
);

-- CREATE TABLE EMPLOYEE
CREATE TABLE EMPLOYEE(
   Employee_id VARCHAR(5),              -- Unique identifier for employees
   Employee_name VARCHAR(25),           -- Name of the employee
   Phone_no DECIMAL(10,0),              -- Employee's phone number
   Email Text,                          -- Employee's email
   Address  VARCHAR(50),                -- Employee's address
   PRIMARY KEY(Employee_Id)             -- Primary key is Employee_Id
);

-- CREATE TABLE ASSEMBLED_BY
CREATE TABLE ASSEMBLED_BY(
   Product_Id VARCHAR(5),               -- Product associated with the assembly
   Part_id VARCHAR(5),                  -- Part associated with the assembly
   Number_of_Parts INT,                 -- Number of specific part required for assembling the product
   PRIMARY KEY(Product_Id,Part_id)      -- Composite primary key
);

-- CREATE TABLE PART
CREATE TABLE PART(
   Part_id VARCHAR(5),                  -- Unique identifier for parts
   Part_name VARCHAR(25),               -- Name of the part
   Weight DECIMAL(12,2),                -- Weight of the part
   PRIMARY KEY(Part_id)                 -- Primary key is Part_id
);

-- CREATE TABLE SUPPLIER
CREATE TABLE SUPPLIER(
   Supplier_id VARCHAR(5),              -- Unique identifier for suppliers
   Part_id VARCHAR(5),                  -- Part supplied by the supplier
   Supplier_name VARCHAR(25),           -- Name of the supplier
   Email TEXT,                          -- Supplier's email
   Phone_no DECIMAL(10,0),              -- Supplier's phone number
   Address VARCHAR(50),                 -- Supplier's address
   Quantity INT,                        -- Quantity of parts supplied for 1 restock_time
   Price decimal(10,2),                 -- Price of the supplied part (for 1 multiple of Quantity)
   Restock_time INT,                    -- Time for restocking
   PRIMARY KEY(Supplier_id)             -- Primary key is Supplier_id
);

-- CREATE TABLE STORAGE
CREATE TABLE STORAGE(
   Store_id VARCHAR(5),                 -- Unique identifier for storage
   Product_id VARCHAR(5),                  -- Part stored in the storage
   Quantity INT,                        -- Quantity of parts in storage
   Park_no INT,                         -- Rack number in the storage
   Block_no VARCHAR(3),                 -- Block number in the storage
   Threshold INT,                       -- Threshold quantity for restocking
   PRIMARY KEY(Store_id)                -- Primary key is Store_id
);

-- CREATE TABLE Admin
CREATE TABLE Admin (
    Admin_ID VARCHAR(5) PRIMARY KEY,    -- Unique identifier for admins (primary key)
    password VARCHAR(100)               -- Admin's password
);

-- CREATE TABLE cart
CREATE TABLE cart (
    user_id VARCHAR(20),                -- User associated with the cart
    product_id VARCHAR(5),              -- Product in the cart
    PRIMARY KEY(user_id,product_id)     -- Composite primary key
);

-- CREATE TABLE SUPPLIER_ORDERS
CREATE TABLE SUPPLIER_ORDERS(
   Supplier_id VARCHAR(5),              -- Supplier associated with the order
   date_time timestamp,                 -- Date and time of the order
   Status ENUM("In Progress","Shipped",
   "Complete", "Cancelled"),            -- Status of the order
   Quantity INT,                        -- Quantity of parts required from the supplier
   PRIMARY KEY (Supplier_id, date_time) -- Composite primary key
);

-- -------------------------------------------------------------------------------------------------------------------
-- ADDING CONSTRAINTS
-- -------------------------------------------------------------------------------------------------------------------

-- ALTER TABLE SUPPLIER_ORDERS
ALTER TABLE SUPPLIER_ORDERS
ADD CONSTRAINT fk_supplier_id FOREIGN KEY(Supplier_ID)
REFERENCES SUPPLIER(Supplier_ID) ON DELETE CASCADE ON UPDATE CASCADE;

-- ALTER TABLE cart
ALTER TABLE cart
ADD CONSTRAINT fk_product_cart FOREIGN KEY(product_id) REFERENCES product(product_id) ON DELETE CASCADE ON UPDATE CASCADE,
ADD CONSTRAINT fk_client_cart FOREIGN KEY(user_id) REFERENCES client(client_id) ON DELETE CASCADE ON UPDATE CASCADE;

-- ALTER TABLE Orders
ALTER TABLE Orders
ADD CONSTRAINT fk_order_client
FOREIGN KEY(Client_ID) REFERENCES Client(Client_ID) ON DELETE CASCADE ON UPDATE CASCADE,
ADD CONSTRAINT fk_order_employee FOREIGN KEY(Employee_ID) REFERENCES EMPLOYEE(Employee_ID);

-- ALTER TABLE Order_Line
ALTER TABLE Order_Line
ADD CONSTRAINT fk_ol_order
FOREIGN KEY(Order_ID) REFERENCES Orders(Order_ID) ON DELETE CASCADE ON UPDATE CASCADE,
ADD CONSTRAINT fk_ol_product FOREIGN KEY(Product_ID) REFERENCES Product(Product_ID) ON DELETE CASCADE ON UPDATE CASCADE;

-- ALTER TABLE Assembled_By
ALTER TABLE Assembled_By
ADD CONSTRAINT fk_as_product FOREIGN KEY(Product_ID) REFERENCES Product(Product_ID) ON DELETE CASCADE ON UPDATE CASCADE,
ADD CONSTRAINT fk_as_part FOREIGN KEY(Part_ID) REFERENCES Part(Part_ID) ON DELETE CASCADE ON UPDATE CASCADE;

-- ALTER TABLE Restock_Details
ALTER TABLE Supplier
ADD CONSTRAINT fk_part_supplier FOREIGN KEY(Part_ID)
REFERENCES Part(Part_ID) ON DELETE SET NULL ON UPDATE CASCADE;

-- ALTER TABLE Storage
ALTER TABLE STORAGE
ADD CONSTRAINT fk_store_product FOREIGN KEY (Product_ID)
REFERENCES Product(Product_ID) ON DELETE CASCADE ON UPDATE CASCADE;


-- Create JOIN Table Order_Parts To Track Aggregate quantity of each Part In an Order
CREATE TABLE IF NOT EXISTS Order_Parts (
    Order_ID VARCHAR(100),
    Part_ID VARCHAR(5),
    Quantity INT,
    Timestamp_ TIMESTAMP,
    Status ENUM('0', '1'),
    PRIMARY KEY (Order_ID, Part_ID),
    FOREIGN KEY (Order_ID) REFERENCES Orders(Order_ID),
    FOREIGN KEY (Part_ID) REFERENCES Part(Part_ID)
);

-- -------------------------------------------------------------------------------------------------------------------
-- INSERT Statements
-- -------------------------------------------------------------------------------------------------------------------

-- Insert 10 rows into the Product table with car brand names and prices
INSERT INTO Product (Product_ID, Product_Name, Product_Description, Category, Price,Image,Assembling_time)
VALUES
   ('P0001', 'Toyota Camry', 'The Toyota Camry, a renowned car model, is the perfect blend of style and performance. This car offers a comfortable and efficient driving experience for those seeking both luxury and reliability.', 'Car', 1825000.00,'toyota-camry.jpeg',2),
   ('P0002', 'Ford F-150', 'The Ford F-150, is built to handle tough tasks with ease. Its robust build and powerful performance make it the ideal choice for work and adventure enthusiasts who require a dependable and rugged vehicle.', 'Truck', 2555000.00,'ford-150.jpeg',1),
   ('P0003', 'Honda Civic', 'The Honda Civic, a classic car model, is synonymous with reliability and efficiency.Known for its fuel economy and sleek design, this car is a top pick for those who value practicality and style on the road.', 'Car', 1460000.00,'Honda_civic.jpeg',1),
   ('P0004', 'Chevrolet Silverado', 'The Chevrolet Silverado, a versatile truck model, is designed to tackle heavy-duty jobs with finesse.With its strong performance and spacious interior, this truck is perfect for individuals who demand power and comfort.', 'Truck', 2190000.00,'chevrolet.jpeg',3),
   ('P0005', 'BMW S1000RR', 'The BMW S1000RR is a high-performance sportbike that combines cutting-edge technology with thrilling speed. With its aerodynamic design and powerful engine, its the ultimate choice for motorcycle enthusiasts.', 'Motorcycle', 1500000.00, 'bmw-s1000rr.jpeg', 1),
   ('P0006', 'Tesla Model 3', 'The Tesla Model 3 is an electric car that redefines sustainability and style. With its sleek design and advanced autopilot features, it offers a futuristic driving experience for eco-conscious individuals.', 'Electric', 4500000.00, 'tesla-model-3.jpeg', 2),
   ('P0007', 'Yamaha YZF R6', 'The Yamaha YZF R6 is a sporty and agile motorcycle designed for adrenaline junkies. Its compact size and powerful engine make it perfect for both city commuting and track racing.', 'Motorcycle', 900000.00, 'yamaha-yzf-r6.jpeg', 1),
   ('P0008', 'Honda Accord', 'The Honda Accord is a reliable and stylish sedan known for its fuel efficiency and comfortable ride. With advanced safety features and modern design, its a top choice for those seeking a dependable daily driver.', 'Auto', 2600000.00, 'honda-accord.jpeg', 2),
   ('P0009', 'Ducati Multistrada V4', 'The Ducati Multistrada V4 is an adventure motorcycle built for versatility and performance. With its powerful engine and rugged design, its the perfect option for riders who enjoy both on and off-road journeys.', 'Auto', 2200000.00, 'ducati-multistrada-v4.jpeg', 1),
   ('P0010', 'Toyota Prius', 'The Toyota Prius is a hybrid car that sets the standard for fuel efficiency. With its eco-friendly features and practical design, its a great choice for environmentally conscious drivers.', 'Hybrid Car', 2500000.00, 'toyota-prius.jpeg', 2);


INSERT INTO PART (Part_id, Part_name, Weight) VALUES
   ('P1', 'Engine', 300.0),
   ('P2', 'Transmission', 150.0),
   ('P3', 'Brake System', 75.0),
   ('P4', 'Suspension System', 80.0),
   ('P5', 'Exhaust System', 50.0),
   ('P6', 'Air Conditioning Unit', 40.0),
   ('P7', 'Steering Wheel', 20.0),
   ('P8', 'Tire Set', 90.0),
   ('P9', 'Car Battery', 30.0),
   ('P10', 'Radiator', 60.0);


INSERT INTO ASSEMBLED_BY (Product_Id, Part_id, Number_of_Parts)
VALUES
   ('P0001', 'P1', 2),
   ('P0001', 'P2', 1),
   ('P0002', 'P3', 1),
   ('P0003', 'P4', 3),
   ('P0004', 'P5', 2),
   ('P0004', 'P6', 1),
   ('P0004', 'P7', 4),
   ('P0004', 'P8', 4),
   ('P0004', 'P9', 1),
   ('P0004', 'P10', 2),
   ('P0005', 'P1', 1),
   ('P0005', 'P3', 1),
   ('P0005', 'P5', 1),
   ('P0006', 'P6', 1),
   ('P0006', 'P7', 2),
   ('P0007', 'P1', 1),
   ('P0007', 'P3', 1),
   ('P0007', 'P5', 1),
   ('P0008', 'P1', 1),
   ('P0008', 'P2', 1),
   ('P0008', 'P4', 2),
   ('P0009', 'P1', 1),
   ('P0009', 'P4', 2),
   ('P0009', 'P5', 1),
   ('P0010', 'P1', 3),
   ('P0010', 'P2', 1),
   ('P0010', 'P3', 4);


INSERT INTO STORAGE (Store_id, Product_id, Quantity, Park_no, Block_no, Threshold)
VALUES
('S1', 'P0001', 5, 1, 'A', 3),
('S2', 'P0002', 4, 2, 'B', 2),
('S3', 'P0003', 6, 3, 'C', 3),
('S4', 'P0004', 7, 4, 'D', 3),
('S5', 'P0005', 3, 5, 'E', 2),
('S6', 'P0006', 2, 6, 'F', 1),
('S7', 'P0007', 8, 7, 'G', 4),
('S8', 'P0008', 9, 8, 'H', 4),
('S9', 'P0009', 10, 9, 'I', 5),
('S10', 'P0010', 4, 10, 'J', 5);



INSERT INTO SUPPLIER (Supplier_id, Part_id, Supplier_name, Email, Phone_no, Address, Quantity, Price, Restock_time)
VALUES
('S0001', 'P1', 'ABC Supplier Inc.', 'supplier1@email.com', 1234567890, '123 Main Street', 100, 100.00, 1),
('S0002', 'P2', 'XYZ Supplies', 'supplier2@email.com', 0987654321, '456 Elm Street', 150, 150.50, 2),
('S0003', 'P3', 'Reliable Parts', 'supplier3@email.com', 3334445555, '789 Oak Street', 200, 200.75, 3),
('S0004', 'P4', 'Quality Components', 'supplier4@email.com', 2225556666, '1011 Maple Avenue', 250, 120.25, 1),
('S0005', 'P5', 'Premier Distributors', 'supplier5@email.com', 6667778888, '1213 Pine Street', 300, 180.00, 3),
('S0006', 'P6', 'Fast Supply', 'supplier6@email.com', 5554443333, '1415 Beach Avenue', 350, 130.50, 2),
('S0007', 'P7', 'Efficient Logistics', 'supplier7@email.com', 4443332222, '1617 Park Avenue', 400, 210.25, 3),
('S0008', 'P8', 'Reliable Sourcing', 'supplier8@email.com', 7778881111, '1819 Elm Street', 450, 300.00, 5),
('S0009', 'P9', 'Global Suppliers', 'supplier9@email.com', 8889990000, '2021 Oak Street', 500, 160.75, 2),
('S0010', 'P10', 'Trusted Partners', 'supplier10@email.com', 9990001111, '2223 Maple Avenue', 550, 110.50, 1);


INSERT INTO EMPLOYEE (Employee_Id, Employee_Name, Phone_no, Email, Address)
VALUES
('E0001', 'Alice Johnson', 1234567890, 'alice@example.com', '123 Main Street'),
('E0002', 'Bob Thompson', 0987654321, 'bob@example.com', '456 Elm Street'),
('E0003', 'Eva Rodriguez', 3334445555, 'eva@example.com', '789 Oak Street'),
('E0004', 'Maxwell Parker', 2225556666, 'maxwell@example.com', '1011 Maple Avenue'),
('E0005', 'Olivia Carter', 6667778888, 'olivia@example.com', '1213 Pine Street'),
('E0006', 'Liam Foster', 5554443333, 'liam@example.com', '1415 Beach Avenue'),
('E0007', 'Sophia Bennett', 4443332222, 'sophia@example.com', '1617 Park Avenue'),
('E0008', 'Daniel Nguyen', 7778881111, 'daniel@example.com', '1819 Elm Street'),
('E0009', 'Isabella Kim', 8889990000, 'isabella@example.com', '2021 Oak Street'),
('E0010', 'Jackson Patel', 9990001111, 'jackson@example.com', '2223 Maple Avenue');


INSERT INTO CLIENT (Client_ID, Client_Name, Email, phone_no, City, PINCODE, Building, Floor_no, password_client)
VALUES
('C0001', 'John Smith', 'john.smith@email.com', 1234567890, 'Bangalore', 560016, 'ABC Apartments', 2, '$2a$10$6fwjJFmzl/M8ZiJchrvUJurlyTbFZBqAeL8ENA5L5DuF79zSCXYMG'),
('C0002', 'Jane Doe', 'jane.doe@email.com', 9807654321, 'Mumbai', 400001, 'XYZ Towers', 5, '$2a$10$YdIOafYEWQUHi9VGmjtM8Ot21QpPe4PjB45ITHcjKvsbGfg1HJawy'),
('C0003', 'Peter Jones', 'peter.jones@email.com', 3334445555, 'Chennai', 600001, 'PQR Residency', 3, '$2a$10$9hdpZ2K.ROjqCNN4ikwkHeVhstoulv4dHtX.JInHdiWLVEUkRt8Q6'),
('C0004', 'Mary Brown', 'mary.brown@email.com', 2225556666, 'Delhi', 110001, 'LMN Apartments', 1, '$2a$10$NFvZc/nrC.sPzqrnexM/3uf3XVoJ86fPYzyA24BEUa1me8oILT56C'),
('C0005', 'David Williams', 'david.williams@email.com', 6667778888, 'Hyderabad', 500001, 'JKL Towers', 7, '$2a$10$V/qNO0QselsftJjafqIXC.4M6unXnGWnDcF4xQDoFQJIa3uAllZWS'),
('C0006', 'Sarah Miller', 'sarah.miller@email.com', 5554443333, 'Ahmedabad', 380001, 'GHI Residency', 4, '$2a$10$y1IOb5zOJ3FhHQPVG7a/yuLN6jU2dOtg9.lAkK5682a/APMVqYW3W'),
('C0007', 'Michael Anderson', 'michael.anderson@email.com', 4443332222, 'Pune', 411001, 'DEF Apartments', 6, '$2a$10$hkwuSS4RYTX0F/nQywCvIel0t2TxhjKmiMjRhMzxwlyqeMrxVe7yG'),
('C0008', 'Susan Taylor', 'susan.taylor@email.com', 7778881111, 'Surat', 395001, 'CDE Towers', 2, '$2a$10$R6ZQkLrNX7J3w9Nykn1YLeGeEL.DMRpjnuE29.wu3r.J2eqt.HxtW'),
('C0009', 'James Johnson', 'james.johnson@email.com', 8889990000, 'Jaipur', 302001, 'BCA Residency', 1, '$2a$10$M4f0B7sMbZxiUvmV0jcnLuK2dpODR2cXsi/1j9WNcycpCd552C4yK'),
('C0010', 'Elizabeth Thomas', 'elizabeth.thomas@email.com', 9990001111, 'Kanpur', 208001, 'ABB Apartments', 3, '$2a$10$74BeC/YXF/trO.Zso2vr9.BEkk7cC81aO9H//K5YWPeAYxDauWYfC');

    INSERT INTO Admin
    VALUES
    ('admin', '$2a$10$ajLYr46aHBjWhpcBV/Ng4O/2n/Anx0H2QPH09cPjPCGNqxHOEQanC');
    ('abc', '$2a$10$95K.TTl.Ma.m4D2yyOJEBOZELaa6coS1vjjXu.xYa95Hi8SvNSHlG');


-- -------------------------------------------------------------------------------------------------------------------
-- TRIGGERS PROCEDURES AND FUNCTIONS
-- -------------------------------------------------------------------------------------------------------------------

-- -------------------------------------------------------------------------------------------------------------------
-- FUNCTION
-- -------------------------------------------------------------------------------------------------------------------

-- Function: Check if all Order_Parts associated with an order are ready
DROP FUNCTION IF EXISTS AllRowsComplete;
DELIMITER //
CREATE FUNCTION AllRowsComplete(orderID VARCHAR(100)) RETURNS INT
DETERMINISTIC
BEGIN
    -- Check if there are any incomplete rows in Order_Parts
    DECLARE Not_Complete INT;
    SELECT MAX(CASE WHEN Status = '0' THEN 1 ELSE 0 END) INTO Not_Complete FROM Order_Parts WHERE Order_ID = orderID;
    RETURN (NOT Not_Complete);
END //
DELIMITER ;

-- -------------------------------------------------------------------------------------------------------------------
-- PROCEDURES
-- -------------------------------------------------------------------------------------------------------------------

-- Procedure: Update OrderParts Table
DROP PROCEDURE IF EXISTS updateOrderParts;
DELIMITER //
CREATE PROCEDURE updateOrderParts(
    IN given_order_id VARCHAR(100),
    IN given_product_id VARCHAR(5),
    IN given_quantity INT
)
BEGIN
    -- Variables for cursor operation
    DECLARE Part_ID_var VARCHAR(5);
    DECLARE Number_of_Parts INT;
    DECLARE Total_Quantity INT;

    DECLARE done INT DEFAULT 0;

    -- Cursor to fetch parts associated with the given product
    DECLARE cur CURSOR FOR
        SELECT a.Part_id, a.Number_of_Parts FROM assembled_by AS a WHERE a.Product_ID = given_product_id;
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = 1;

    OPEN cur;

    AssembledByLoop: LOOP
        FETCH cur INTO Part_ID_var, Number_of_Parts;
        IF done THEN
            LEAVE AssembledByLoop;
        END IF;

        -- Check if the part is already in the Order_Parts table
        SELECT COUNT(*) INTO Total_Quantity FROM Order_Parts 
        WHERE Order_ID = given_order_id AND Part_ID = Part_ID_var;

        -- Update or insert into Order_Parts based on existence
        IF Total_Quantity > 0 THEN
            UPDATE Order_Parts
            SET Quantity = (Quantity + (Number_of_Parts*given_quantity))
            WHERE Order_ID = given_order_id AND Part_ID = Part_ID_var;
        ELSE
            INSERT INTO Order_Parts (Order_ID, Part_ID, Quantity, Timestamp_, Status)
            VALUES (given_order_id, Part_ID_var, Number_of_Parts*given_quantity, NOW(), '0');
        END IF;
    END LOOP;

    CLOSE cur;
END; //
DELIMITER ;

-- Procedure: Check Storage for Availability or Place Supplier Order
DELIMITER //
CREATE PROCEDURE  ProcessOrderPart(
    IN given_order_id VARCHAR(100),
    IN given_part_id VARCHAR(5),
    IN given_quantity INT
)
BEGIN
    -- Variables for storage and supplier information
    DECLARE Storage_Quantity INT;
    DECLARE Supplier_Quantity INT;

    DECLARE Supplier_Status_var enum('In Progress','Shipped','Complete','Cancelled');
    DECLARE Supplier_ID_var VARCHAR(5);
    DECLARE Supplier_Date_Time_var TIMESTAMP;

    -- Check if quantity is present in storage
    SELECT Quantity INTO Storage_Quantity
    FROM Storage
    WHERE Part_ID = given_part_id;

    IF Storage_Quantity >= given_quantity THEN
        -- Sufficient quantity in storage, update storage and order_parts
        UPDATE Storage
        SET Quantity = Quantity - given_quantity
        WHERE Part_ID = given_part_id;

        UPDATE Order_Parts
        SET Status = '1' WHERE Order_ID = given_order_id AND Part_ID = given_part_id;
    ELSE
        -- Insufficient quantity, place order with the supplier
        SELECT Supplier_ID, CURRENT_TIMESTAMP(), 'In Progress', given_quantity
        INTO Supplier_ID_var, Supplier_Date_Time_var, Supplier_Status_var, Supplier_Quantity
        FROM Supplier
        WHERE Part_ID = given_part_id;

        -- Insert entry into supplier_orders table
        INSERT INTO supplier_orders (Supplier_id, date_time, Status, Quantity)
        VALUES (Supplier_ID_var, Supplier_Date_Time_var, Supplier_Status_var, Supplier_Quantity);
    END IF;
END //
DELIMITER ;

-- Procedure: Process all rows in OrderParts table
DELIMITER //
CREATE PROCEDURE ProcessOrderParts(
    IN given_order_id VARCHAR(100)
)
BEGIN
    DECLARE done INT DEFAULT FALSE;
    DECLARE part_id_var VARCHAR(5);
    DECLARE quantity_var INT;
    DECLARE cur CURSOR FOR
        SELECT Part_id, Quantity
        FROM Order_Parts
        WHERE Order_ID = given_order_id
    ORDER BY Part_ID;

    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;

    OPEN cur;

    read_loop: LOOP
        FETCH cur INTO part_id_var, quantity_var;
        IF done THEN
            LEAVE read_loop;
        END IF;
        -- Call ProcessOrderPart for each row in OrderParts table
        CALL ProcessOrderPart(given_order_id, part_id_var, quantity_var);
    END LOOP;

    CLOSE cur;
END //
DELIMITER ;

-- Procedure: Update Order status and Storage Quantity
DELIMITER //
CREATE PROCEDURE UpdateOrderAndStorage(IN PartID VARCHAR(5), IN NewQuantity INT)
BEGIN
    DECLARE OrderID_var VARCHAR(100);
    DECLARE Part_Quantity INT;
    DECLARE done INT DEFAULT 0;

    -- Declare a cursor to iterate over Order_Parts rows in descending order of timestamp
    DECLARE cur CURSOR FOR
        SELECT Order_ID, Quantity
        FROM Order_Parts
        WHERE Part_ID = PartID AND Status = '0'
        ORDER BY Timestamp_ DESC;

    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = 1;

    OPEN cur;

    -- Start iterating over Order_Parts rows
    orderLoop: LOOP
        FETCH cur INTO OrderID_var, Part_Quantity;

        -- Exit the loop if no more rows are found
        IF done THEN
            LEAVE orderLoop;
        END IF;

        -- If order quantity is met, mark Order_Parts as ready and update Storage
        IF Part_Quantity <= NewQuantity THEN
            UPDATE Order_Parts SET Status = '1' WHERE Order_ID = OrderID_var AND Part_ID = PartID;
            SET NewQuantity = NewQuantity - Part_Quantity;
        END IF;
    END LOOP;
    CLOSE cur;

    -- Update Storage with the remaining quantity
    UPDATE Storage SET Quantity = Quantity + NewQuantity WHERE Part_ID = PartID;
END //
DELIMITER ;

-- -------------------------------------------------------------------------------------------------------------------
-- TRIGGERS
-- -------------------------------------------------------------------------------------------------------------------

-- Trigger: Delete cart items after order confirmation
DELIMITER //
CREATE TRIGGER delete_carts_after_insert
AFTER INSERT ON orders
FOR EACH ROW
BEGIN
  -- Delete items from the cart for the user whose order is confirmed
  DELETE FROM cart WHERE user_id = NEW.client_id;
END //
DELIMITER ;

-- Trigger: Process Order_Line after insertion
DROP TRIGGER IF EXISTS Process_Order_Line;
DELIMITER //
CREATE TRIGGER Process_Order_Line
AFTER INSERT
ON Order_Line
FOR EACH ROW
BEGIN
    -- Call updateOrderParts when a new order line is inserted
    CALL updateOrderParts(NEW.Order_ID, NEW.Product_ID, NEW.Quantity);
END //
DELIMITER ;

-- Trigger: Check if all order lines in an order are ready and update order status
DROP TRIGGER IF EXISTS checkOrderStatus;
DELIMITER //
CREATE TRIGGER checkOrderStatus
AFTER UPDATE
ON Order_Parts
FOR EACH ROW
BEGIN
    DECLARE Order_ID_var VARCHAR(100);
    -- If a row is marked as ready and the order is not complete, update order status
    IF NEW.Status = '1' THEN
        SELECT NEW.Order_ID INTO Order_ID_var;
        IF AllRowsComplete(Order_ID_var) = 1 THEN
            UPDATE Orders
            SET Status = 'Complete'
            WHERE Order_ID = Order_ID_var;
        END IF;
    END IF;
END //
DELIMITER ;

-- Trigger: Check if storage quantity falls below threshold and place a supplier order
DROP TRIGGER IF EXISTS checkThreshold;
DELIMITER //
CREATE TRIGGER checkThreshold
AFTER UPDATE
ON Storage
FOR EACH ROW
BEGIN
    DECLARE Part_ID_var VARCHAR(5);
    DECLARE Supplier_ID_var VARCHAR(5);
    DECLARE OrderPartsID_var VARCHAR(100);

    SELECT NEW.Part_ID INTO Part_ID_var;
    -- If storage quantity falls below the threshold, place a supplier order
    IF NEW.Quantity < OLD.Quantity THEN
        IF NEW.Quantity < NEW.Threshold THEN
            SELECT Supplier_ID INTO Supplier_ID_var
            FROM Supplier
            WHERE Supplier.Part_ID = Part_ID_var;

            -- Insert an entry into Supplier_Orders
            INSERT INTO Supplier_Orders VALUES (Supplier_ID_var, CURRENT_TIMESTAMP(), 
            'In Progress', NEW.Threshold * 2);
        END IF;
    END IF;
END //
DELIMITER ;

-- Trigger: Update storage quantity when a supplier order is complete
DELIMITER //
CREATE TRIGGER updateStorageQuantity
AFTER UPDATE
ON Supplier_Orders
FOR EACH ROW
BEGIN
    DECLARE Part_ID_var VARCHAR(5);
    DECLARE newQuantity INT;

    -- Fetch relevant information from the Supplier table
    SELECT Part_ID INTO Part_ID_var FROM Supplier WHERE Supplier_ID = NEW.Supplier_ID;
    SELECT NEW.Quantity INTO newQuantity;

    -- If the supplier order is complete, call the stored procedure to update Order_Parts and Storage
    IF NEW.Status LIKE 'Complete' THEN
        CALL UpdateOrderAndStorage(Part_ID_var, newQuantity);
    END IF;
END //
DELIMITER ;


-- -------------------------------------------------------------------------------------------------------------------
-- NESTED Queries
-- -------------------------------------------------------------------------------------------------------------------


-- -------------------------------------------------------------------------------------------------------------------
-- NESTED Queries
-- -------------------------------------------------------------------------------------------------------------------

SELECT
    c.Client_ID,
    c.Client_Name,
    p.Category,
    SUM(ol.Quantity) AS TotalQuantity
FROM
    Client c
    LEFT JOIN Orders o ON c.Client_ID = o.Client_ID
    LEFT JOIN Order_Line ol ON o.Order_ID = ol.Order_ID
    LEFT JOIN Product p ON ol.Product_ID = p.Product_ID
WHERE
    p.Category IS NOT NULL
GROUP BY
    c.Client_ID,
    c.Client_Name,
    p.Category
HAVING
    SUM(ol.Quantity) = (
        SELECT
            MAX(TotalQuantityInner)
        FROM (
            SELECT
                SUM(ol_inner.Quantity) AS TotalQuantityInner
            FROM
                Orders o_inner
                LEFT JOIN Order_Line ol_inner ON o_inner.Order_ID = ol_inner.Order_ID
                LEFT JOIN Product p_inner ON ol_inner.Product_ID = p_inner.Product_ID
                LEFT JOIN Client c_inner ON o_inner.Client_ID = c_inner.Client_ID 
            WHERE
                c.Client_ID = o_inner.Client_ID
            GROUP BY
                p_inner.Category
        ) AS InnerQuery
    );


SELECT
    c.Client_ID,
    c.Client_Name,
    p.Category,
    SUM(ol.Quantity) AS TotalQuantity
FROM
    Client c
    LEFT JOIN Orders o ON c.Client_ID = o.Client_ID
    LEFT JOIN Order_Line ol ON o.Order_ID = ol.Order_ID
    LEFT JOIN Product p ON ol.Product_ID = p.Product_ID
WHERE
    p.Category IS NOT NULL
GROUP BY
    c.Client_ID,
    c.Client_Name,
    p.Category
HAVING
    SUM(ol.Quantity) = (
        -- Return Max
        SELECT
            MAX(TotalQuantityInner)
        FROM (
            -- Return For one category all the quantity which a client have boought it.
            SELECT
                SUM(ol_inner.Quantity) AS TotalQuantityInner
            FROM
                Orders o_inner
                LEFT JOIN Order_Line ol_inner ON o_inner.Order_ID = ol_inner.Order_ID
                LEFT JOIN Product p_inner ON ol_inner.Product_ID = p_inner.Product_ID
                LEFT JOIN Client c_inner ON o_inner.Client_ID = c_inner.Client_ID 
            WHERE
                p.Category = p_inner.Category
            GROUP BY
                c_inner.Client_ID
        ) AS InnerQuery
    );

SELECT
    c.Client_Name,
    c.Email
FROM
    Client c
WHERE
    NOT EXISTS (
        SELECT 1
        FROM Orders o
        WHERE o.Client_ID = c.Client_ID
    );

