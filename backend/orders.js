import db from "./db.js"

export const fetch_orders = (req, res) => {
    const get_orders = 'SELECT * from Orders';
  
    db.query(get_orders, [], (err, data) => {
      if (err)
        return res.json(err);
      res.json(data);
    });
}

export const fetch_order_line = (req, res) => {
  const get_order_line = 'SELECT * from Order_line where Order_id=?';
  const order_id = req.params.id
  console.log("hello order id is",order_id)
  db.query(get_order_line, [order_id], (err, data) => {
    if (err)
      return res.json(err);
    res.json(data);
  });
}

export const addEmployee = (req, res) => {
    const Employee_ID = req.body[0];
    const Order_ID = req.params.id;
    const query = "UPDATE Orders SET Employee_ID = ? WHERE Order_ID = ?";
    db.query(query, [Employee_ID, Order_ID], (err, data) => {
      if (err) {
        return res.status(500).json({ error: 'Internal server error' });
      }
      return res.json("Update Successful");
    })
}