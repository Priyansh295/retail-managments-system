import express from 'express';
import db from './db.js';
import fileUpload from 'express-fileupload';
import { login_admin, login_client, logout_admin, logout_client, register, login_employee, logout_employee } from "./auth_controller.js";
import { add_supplier, delete_supplier, fetch_suppliers, update_supplier } from './supplier_crud.js';
import { add_employee, delete_employee, fetch_employees, update_employee } from './employees_crud.js';
import { add_product, delete_product, get_product_parts } from './products_crud.js';
import { add_store, delete_store, fetch_stores, update_store} from './storage_crud.js';
import { fetch_orders,fetch_order_line, addEmployee } from './orders.js';
import {fetch_storage} from './storage_crud.js'
import { fetch_supplier_orders, update_supplier_order_status } from './supplier_orders.js';

import { fetch_stats_category,fetch_stats_client_order,fetch_stats_client_product,fetch_stats_products_date, fetch_stats_most_category, fetch_stats_monthly_products,fetch_stats_category_details, fetch_stats_no_orders, fetch_stats_most_products } from './statistic.js';
import { fetch_client, update_client,update_password, fetch_admin, update_admin_password,add_admin} from './client_crud.js';
import fetchSummary from './summary_stats.js';
const router = express.Router();

router.use(fileUpload());

router.get('/', (req, res) => {
  res.send('Backend Server');
});

router.get('/products', (req, res) => {
  const query = 'SELECT * FROM Product';
  db.query(query, (err, data) => {
    if (err) return res.send(err);
    res.send(data);
  });
});

router.get('/orders', (req, res) => {
  const query = 'SELECT * FROM Orders';
  db.query(query, (err, data) => {
    if (err) return res.send(err);
    res.send(data);
  });
});



router.post('/products', (req, res) => {
  const query = 'INSERT INTO product VALUES (?)';
  const values = [
    req.body.Product_ID,
    req.body.Product_Name,
    req.body.Product_Description,
    req.body.Category,
    req.body.Price,
    req.body.Image,
  ];

  db.query(query, [values], (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

router.post('/products/add', add_product);

// Update a product
router.put('/products/:id', (req, res) => {
    const productId = req.params.id;
    const { Product_Name, Product_Description, Category, Price, Product_ID} = req.body;
    console.log("here")
    if (!Product_ID || !Product_Name || !Product_Description || !Category || !Price) {
        return res.status(400).json({ error: 'Invalid input data' });
      }
    const query = `
      UPDATE Product
      SET Product_Name=?, Product_Description=?, Category=?, Price=?
      WHERE Product_ID=?
    `;
    const values = [Product_Name, Product_Description, Category, Price, productId];

    db.query(query, values, (err, result) => {
        if (err) {
          console.error('Error adding product to the database:', err);
          return res.status(500).json({ error: 'Internal server error' });
        }
        console.log('Product Updated successfully with image');
        return res.status(200).json({ success: true });
      });
  });

// Delete a product
router.delete('/products/:id', delete_product);

// Add a product to the cart
router.post('/products/cart/add', (req, res) => {
  const { user_id, product_id} = req.body;
  if (!user_id || !product_id) {
    return res.status(400).json({ error: 'Invalid input data' });
  }

  const add_to_cart_query = 'INSERT INTO Cart (User_ID, Product_ID) VALUES (?, ?)';
  const add_to_cart_values = [user_id, product_id];

  db.query(add_to_cart_query, add_to_cart_values, (err, result) => {
    if (err) {
      console.error('Error adding product to the cart:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }

    console.log('Product added to the cart successfully');
    res.status(200).json({ success: true });
  });
});

// Get cart contents
router.get('/products/cart/:user_id', (req, res) => {
  const user_id = req.params.user_id;
  // console.log(req.body)
  const get_cart_contents_query = 'select * from cart natural join product where user_id=?';

  db.query(get_cart_contents_query, [user_id], (err, data) => {
    if (err)
      return res.send(err);
    res.send(data);
  });
});

// Remove item from the cart
router.delete('/products/cart/:user_id/:product_id', (req, res) => {
  const user_id = req.params.user_id;
  const product_id = req.params.product_id;

  const remove_from_cart_query = 'DELETE FROM Cart WHERE User_ID = ? AND Product_ID = ?';

  db.query(remove_from_cart_query, [user_id, product_id], (err, result) => {
    if (err) {
      console.error('Error removing item from the cart:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }

    console.log('Item removed from the cart successfully');
    res.json({ success: true });
  });
});

router.post("/register", register)
router.post("/login_client", login_client)
router.post("/login_admin", login_admin)
router.post("/logout_client", logout_client)
router.post("/logout_admin", logout_admin)
router.post("/login_employee", login_employee);
router.post("/logout_employee", logout_employee);
// Fetch suppliers
router.get('/suppliers', fetch_suppliers);

// Delete supplier
router.delete('/suppliers/:id', delete_supplier);

// Add a new supplier
router.post('/suppliers/add', add_supplier);

// update supplier
router.put('/suppliers/:id', update_supplier);



// Fetch employees
router.get('/employees', fetch_employees);

// Delete employee
router.delete('/employees/:id', delete_employee);

// Add a new employee
router.post('/employees/add', add_employee);

// update employee
router.put('/employees/:id', update_employee);

// Fetch suppliers
router.get('/suppliers', fetch_suppliers);

// Delete supplier
router.delete('/suppliers/:id', delete_supplier);

// Add a new supplier
router.post('/suppliers/add', add_supplier);

// update supplier
router.put('/suppliers/:id', update_supplier);


// Fetch storage
router.get('/stores', fetch_stores);

// Delete store
router.delete('/stores/:id', delete_store);

// Add a new store
router.post('/stores/add', add_store);

// update store
router.put('/stores/:id', update_store);


// Fetch employees
router.get('/employees', fetch_employees);

// Delete employee
router.delete('/employees/:id', delete_employee);

// Add a new employee
router.post('/employees/add', add_employee);

// update employee
router.put('/employees/:id', update_employee);


router.post('/products/order_lines', async (req, res) => {
  try {
    const orderLineItem = req.body;
    
    // Check if the required data is provided
    if (!orderLineItem || typeof orderLineItem !== 'object') {
      return res.status(400).json({ error: 'Invalid input data' });
    }
    
    const { Order_ID, Product_ID, Status, Quantity } = orderLineItem;
    console.log(Order_ID)
    // Validate required fields
    if (!Order_ID || !Product_ID || !Status || !Quantity) {
      return res.status(400).json({ error: 'Missing required fields in order line data' });
    }
    
    const addOrderLineQuery = `
    INSERT INTO Order_Line (Order_ID, Product_ID, Status, Quantity)
    VALUES (?, ?, ?, ?)
    `;
    
    const addOrderLineValues = [Order_ID, Product_ID, Status, Quantity];
    
    db.query(addOrderLineQuery, addOrderLineValues, (err, result) => {
      if (err) {
        console.error('Error adding order line:', err);
        res.status(500).json({ error: 'Internal server error' });
      } else {
        console.log('Order line added successfully');
        res.status(200).json({ success: true });
      }
    });
  } catch (error) {
    console.error('Error adding order line:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/procedure',(req,res)=>{
  const Order_ID = req.body[0];
  console.log(req.body)
  console.log(Order_ID);
  const callStoredProcedureQuery = 'CALL ProcessOrderParts(?)';
  const orderIdParameter = [Order_ID];
  console.log(orderIdParameter)
  db.query(callStoredProcedureQuery, orderIdParameter, (err, result) => {
    console.log("IN procedure")
    if (err) {
      console.error('Error calling stored procedure:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    console.log('Stored procedure called successfully');
  })
})

router.post('/products/order', (req, res) => {
  const {Order_id,
    client_id,
    Total_payment,
    Status
  } = req.body;
  const insertOrderQuery =
  'INSERT INTO Orders (Order_ID, Client_ID, Total_Payment,Status, Order_Placement_Date) VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP())';
  
  const orderValues = [
    Order_id,
    client_id,
    Total_payment,
    Status
  ];
  
  db.query(insertOrderQuery, orderValues, (err, result) => {
    if (err) {
      console.error('Error inserting order:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    console.log('Order added successfully');
    res.status(200).json({ success: true });
  });
});

router.get('/products/orders/:clientID', (req, res) => {
  // console.log("HELLO")
  const clientID = req.params.clientID;
  // console.log(clientID)
  const query = 'SELECT * FROM Orders WHERE Client_ID = ?';
  db.query(query, [clientID], (err, data) => {
    if (err) {
      console.error('Error fetching orders:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    res.json(data);
  });
});

router.get('/order-details/:orderId', (req, res) => {
  const orderId = req.params.orderId;
  const query = 'SELECT * FROM Order_Line WHERE Order_ID = ? AND Status=?';
  db.query(query, [orderId,'In Progress'], (err, orderLines) => {
    if (err) {
      console.error('Error fetching order details:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    
    // Fetch product details for each order line
    const productDetails = [];
    orderLines.forEach((orderLine) => {
      const productQuery = 'SELECT * FROM Product WHERE Product_ID = ?';
      db.query(productQuery, [orderLine.Product_ID], (err, product) => {
        if (err) {
          console.error('Error fetching product details:', err);
          return res.status(500).json({ error: 'Internal server error' });
        }
        productDetails.push({ orderLine, product });
        if (productDetails.length === orderLines.length) {
          // Send the response once all product details are fetched
          res.json(productDetails);
        }
      });
    });
  });
});

router.get('/order-history/:orderId', (req, res) => {
  const orderId = req.params.orderId;
  const query = 'SELECT * FROM Order_Line WHERE Order_ID = ? AND Status=?';
  db.query(query, [orderId,'Complete'], (err, orderLines) => {
    if (err) {
      console.error('Error fetching order details:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    
    // Fetch product details for each order line
    const productDetails = [];
    orderLines.forEach((orderLine) => {
      const productQuery = 'SELECT * FROM Product WHERE Product_ID = ?';
      db.query(productQuery, [orderLine.Product_ID], (err, product) => {
        if (err) {
          console.error('Error fetching product details:', err);
          return res.status(500).json({ error: 'Internal server error' });
        }
        productDetails.push({ orderLine, product });
        if (productDetails.length === orderLines.length) {
          // Send the response once all product details are fetched
          res.status(200).json(productDetails);
        }
      });
    });
  });
});

//Fetch Orders
router.get('/orders',fetch_orders);
router.get('/order_line/:id',fetch_order_line);
router.get('/storage',fetch_storage);

router.get('/supplier-orders', fetch_supplier_orders);
router.put('/supplier-orders/update-status/:id', update_supplier_order_status);


router.get('/timestamp', (req, res) => {
  const query = 'SELECT CONVERT_TZ(CURRENT_TIMESTAMP(), \'+00:00\', \'+05:30\') AS local_timestamp;';
  // Replace '+00:00' and '+05:30' with the UTC offset and local offset of your timezone
  
  db.query(query, [], (err, data) => {
    if (err) {
      console.error('Error fetching Timestamp:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    // console.log(data);
    return res.json(data[0]['local_timestamp']);
  });
});

router.get('/supplier-orders', fetch_supplier_orders);
router.put('/supplier-orders/update-status/:id', update_supplier_order_status);


router.get('/timestamp', (req, res) => {
  const query = 'SELECT CONVERT_TZ(CURRENT_TIMESTAMP(), \'+00:00\', \'+05:30\') AS local_timestamp;';
  // Replace '+00:00' and '+05:30' with the UTC offset and local offset of your timezone
  
  db.query(query, [], (err, data) => {
    if (err) {
      console.error('Error fetching Timestamp:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    // console.log(data);
    return res.json(data[0]['local_timestamp']);
  });
});

router.put('/orders-deliver/:orderId', (req, res) => {
  const orderId = req.params.orderId;
  const status = 'Shipped'; // New status
  console.log('Received orderId:', orderId);
  const updateQuery = 'UPDATE Orders SET Status = ? WHERE Order_ID = ?';
  db.query(updateQuery, [status, orderId], (err, result) => {
    if (err) {
      console.error('Error updating order status:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    
    // Check if any rows were affected
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    // Send success response
    res.status(200).json({ message: 'Order status updated successfully' });
  });
});

// Client and Admin Details
router.get('/client/:id',fetch_client);
router.put('/client/update/:id',update_client);
router.post('/client/change-password',update_password);
router.get('/admin/:id',fetch_admin);
router.post('/admin/change-password',update_admin_password);
router.post('/admin/add',add_admin);
router.post('/admin/add', add_admin);

//Statistic
router.get('/products/categories',fetch_stats_category);
router.get('/orders/clients',fetch_stats_client_order);
router.get('/products/clients',fetch_stats_client_product);
router.get('/products/date',fetch_stats_products_date);
router.get('/clients/most-category',fetch_stats_most_category);
router.get('/products/monthly',fetch_stats_monthly_products);
router.get('/categoryDetails',fetch_stats_category_details);
router.get('/no-orders',fetch_stats_no_orders);
router.get('/productDetails',fetch_stats_most_products);


router.get('/summarystats', fetchSummary);
router.put('/orders/employee/:id', addEmployee);

export default router;