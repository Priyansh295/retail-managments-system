-- Script Overview:
-- This script defines triggers and procedures to handle order processing and inventory management in a database system without the Part entity and supplier orders.

-- -------------------------------------------------------------------------------------------------------------------
-- TRIGGERS PROCEDURES AND FUNCTIONS
-- -------------------------------------------------------------------------------------------------------------------

-- -------------------------------------------------------------------------------------------------------------------
-- PROCEDURES
-- -------------------------------------------------------------------------------------------------------------------

-- Procedure: Update Storage Quantity
DELIMITER //
CREATE PROCEDURE UpdateStorageQuantity(IN ProductID VARCHAR(5), IN NewQuantity INT)
BEGIN
    -- Update Storage directly with the new quantity
    UPDATE Storage
    SET Quantity = Quantity + NewQuantity
    WHERE Product_ID = ProductID;
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