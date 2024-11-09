import db from "./db.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

export const fetch_client = (req, res) => {
    const get_parts = 'SELECT * from client where client_id=?';
    // console.log("id",req.params.id)
    db.query(get_parts, [req.params.id], (err, data) => {
        if (err)
            return res.json(err);
        res.json(data);
    });
}

export const fetch_admin = (req, res) => {
  const get_parts = 'SELECT * from admin where admin_id=?';
  console.log("id",req.params.id)
  db.query(get_parts, [req.params.id], (err, data) => {
      if (err)
          return res.json(err);
      // console.log(data)
      res.json(data);
  });
}

// Assuming you have a MySQL database connection named 'db'

export const update_client = (req, res) => {
    const client_id = req.params.id;
   console.log(req)
   console.log(client_id)
    // Validate the presence of required fields
    if (!client_id || !req.body.Client_name || !req.body.Email || !req.body.Phone_no ||
        !req.body.City || !req.body.Pincode || !req.body.Building || !req.body.Floor_no) {
      return res.status(400).json({ error: 'Invalid input data' });
    }
  
    // Construct the SQL query to update the client details
    const query = `
      UPDATE Client 
      SET 
        Client_Name=?, 
        Email=?, 
        phone_no=?, 
        City=?, 
        PINCODE=?, 
        Building=?, 
        Floor_no=?
      WHERE 
        Client_ID=?
    `;
  console.log("Hello")
    // Define the values to be inserted into the query
    const values = [
      req.body.Client_name,
      req.body.Email,
      req.body.Phone_no,
      req.body.City,
      req.body.Pincode,
      req.body.Building,
      req.body.Floor_no,
      client_id,
    ];
  
    // Execute the SQL query
    db.query(query, values, (err, data) => {
      if (err) {
        console.error('Error updating client:', err);
        return res.status(500).json({ error: 'Internal server error' });
      }
  
      console.log('Client Updated successfully.');
      return res.status(200).json('Client Updated successfully.');
    });
  };

  export const update_password = (req, res) => {
    const { client_id, currentPassword, newPassword } = req.body;
   console.log(req.body)
    // Fetch the hashed password from the database
    const getPasswordQuery = 'SELECT Password_client FROM client WHERE Client_ID = ?';
  
    db.query(getPasswordQuery, [client_id], async (err, result) => {
      if (err) {
        console.error('Error fetching password:', err);
        res.status(500).json({ error: 'Internal Server Error' });
      } else if (result.length === 0) {
        res.status(404).json({ error: 'Client not found' });
      } else {
        const hashedPassword = result[0].Password_client;
        const isPasswordMatch = bcrypt.compareSync(currentPassword, hashedPassword);
        if (isPasswordMatch) {
          // If passwords match, update to the new hashed password
        //   console.log("Entered")
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(newPassword, salt);
  
          const updatePasswordQuery = 'UPDATE client SET Password_client = ? WHERE Client_ID = ?';
  
          db.query(updatePasswordQuery, [hash, client_id], (err, result) => {
            if (err) {
              console.error('Error updating password:', err);
              res.status(500).json({ error: 'Internal Server Error' });
            } else {
              res.status(200).json({ message: 'Password updated successfully' });
            }
          });
        } else {
          res.status(401).json({ error: 'Invalid current password' });
        }
      }
    });
  };

  export const update_admin_password = (req, res) => {
    const { admin_id, currentPassword, newPassword } = req.body;
    // console.log(req.body)
    // Fetch the hashed password from the database
    const getPasswordQuery = 'SELECT Password FROM admin WHERE admin_ID = ?';
  
    db.query(getPasswordQuery, [admin_id], async (err, result) => {
      if (err) {
        console.error('Error fetching password:', err);
        res.status(500).json({ error: 'Internal Server Error' });
      } else if (result.length === 0) {
        res.status(404).json({ error: 'Client not found' });
      } else {
        console.log("result",result)
        const hashedPassword = result[0].Password;
        const isPasswordMatch = bcrypt.compareSync(currentPassword, hashedPassword);
        if (isPasswordMatch) {
          // If passwords match, update to the new hashed password
        //   console.log("Entered")
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(newPassword, salt);
        const updatePasswordQuery = 'UPDATE admin SET Password = ? WHERE admin_ID = ?';
        db.query(updatePasswordQuery, [hash, admin_id], (err, result) => {
            if (err) {
              console.error('Error updating password:', err);
              res.status(500).json({ error: 'Internal Server Error' });
            } else {
              res.status(200).json({ message: 'Password updated successfully' });
            }
          });
        } else {
          res.status(401).json({ error: 'Invalid current password' });
        }
      }
    });
  };

export const add_admin = (req,res) =>{
  console.log(req.body);

  const adminId = req.body.adminId;
  const query = 'SELECT * FROM Admin WHERE Admin_ID = ?';

  db.query(query, [adminId], (err, data) => {
    if (err) return res.json(err);

    if (data.length) {
      console.log(data, data.length);
      return res.status(409).json({ error: 'Admin ID is already in use.' });
    }

    const insertQuery = 'INSERT INTO Admin (Admin_ID, password) VALUES (?, ?)';
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);
    const values = [req.body.adminId, hash];

    db.query(insertQuery, values, (err, result) => {
      if (err) return res.json(err);
      return res.status(200).json({ message: 'Admin has been added.' });
    });
  });
}
  

  
  