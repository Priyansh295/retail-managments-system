-- Script Overview:
-- This script defines triggers, procedures, and functions to handle order processing,
-- inventory management, and supplier interactions in a database system.

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