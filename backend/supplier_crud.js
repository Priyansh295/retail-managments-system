import db from "./db.js"

export const update_supplier = (req, res) => {
    console.log("here");
    const supplier_id = req.params.id
    if (!supplier_id || !req.body.Supplier_name || !req.body.Quantity
       || !req.body.Email || !req.body.Phone_no || !req.body.Address) {
      return res.status(400).json({ error: 'Invalid input data' });
    }
    const query = `
    UPDATE Supplier
    SET Supplier_name=?, Quantity=?, Email=?, Phone_no=?, Address=?, Price=?, Restock_time=?
    WHERE Supplier_id=?;
    `;
    const v = [
      req.body.Supplier_name,
      req.body.Quantity,
      req.body.Email,
      req.body.Phone_no,
      req.body.Address,
      req.body.Price,
      req.body.Restock_time,
      supplier_id,
    ]
    console.log(supplier_id, v);
    db.query(query, v, (err, data) => {
        if (err) {
          console.error('Error updating supplier:', err);
          return res.status(500).json({ error: 'Internal server error' });
        }
        console.log('Supplier Updated successfully.');
        return res.status(200).json('Supplier Updated successfully.');
      });
}

export const add_supplier = (req, res) => {
    console.log(req.body);
    const supplier_id = req.body.Supplier_id
    const query = "SELECT * FROM Supplier WHERE Supplier_id = ?";
    db.query(query, [supplier_id], (err, data) => {
      if(err) return res.json(err)
      if(data.length) {
          console.log(data, data.length)
          return res.status(409).json("Supplier already exists")
      }
      const q = "INSERT INTO Supplier VALUES (?)"
      const v = [
          req.body.Supplier_id,
          req.body.Part_id,
          req.body.Supplier_name,
          req.body.Email,
          req.body.Phone_no,
          req.body.Address,
          req.body.Quantity,
          req.body.Price,
          req.body.Restock_time
      ]
      console.log(v)
      db.query(q, [v], (err, data) => {
          if(err) return res.json(err);
          return res.status(200).json("Supplier has been created.");
      })
  
    })
}

export const fetch_suppliers = (req, res) => {
    const get_suppliers = 'SELECT * from Supplier';
    db.query(get_suppliers, [], (err, data) => {
      if (err)
        return res.json(err);
      res.json(data);
    });
}

export const delete_supplier = (req, res) => {
    const del_supplier = 'DELETE FROM Supplier WHERE Supplier_id = ?';
    const supplier_id = req.params.id
    db.query(del_supplier, [supplier_id], (err, data) => {
      if (err) {
        console.log(err)
        return res.json(err);
      }
      return res.json("Supplier Deleted Successfully.")
    });
}