import db from "./db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Fetch operations
export const fetch_client = (req, res) => {
    const query = 'SELECT * from client where client_id=?';
    db.query(query, [req.params.id], (err, data) => {
        if (err)
            return res.json(err);
        res.json(data);
    });
}

export const fetch_admin = (req, res) => {
    const query = 'SELECT * from admin where admin_id=?';
    console.log("id", req.params.id);
    db.query(query, [req.params.id], (err, data) => {
        if (err)
            return res.json(err);
        res.json(data);
    });
}

export const fetch_employee = (req, res) => {
    const query = 'SELECT * from EMPLOYEE where Employee_id=?';
    console.log("id", req.params.id);
    db.query(query, [req.params.id], (err, data) => {
        if (err)
            return res.json(err);
        res.json(data);
    });
}

export const update_client = (req, res) => {
    const client_id = req.params.id;
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

    db.query(query, values, (err, data) => {
        if (err) {
            console.error('Error updating client:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }
        console.log('Client Updated successfully.');
        return res.status(200).json('Client Updated successfully.');
    });
}

export const update_employee = (req, res) => {
    const employee_id = req.params.id;
    const query = `
        UPDATE EMPLOYEE 
        SET 
            Employee_name=?, 
            Phone_no=?,
            Email=?,
            Address=?
        WHERE 
            Employee_id=?
    `;
    const values = [
        req.body.Employee_name,
        req.body.Phone_no,
        req.body.Email,
        req.body.Address,
        employee_id,
    ];

    db.query(query, values, (err, data) => {
        if (err) {
            console.error('Error updating employee:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }
        console.log('Employee Updated successfully.');
        return res.status(200).json('Employee Updated successfully.');
    });
}

// Password update operations
export const update_password = (req, res) => {
    const { client_id, currentPassword, newPassword } = req.body;
    const getPasswordQuery = 'SELECT Password_client FROM client WHERE Client_ID = ?';

    db.query(getPasswordQuery, [client_id], (err, result) => {
        if (err) {
            console.error('Error fetching password:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        } else if (result.length === 0) {
            return res.status(404).json({ error: 'Client not found' });
        } else {
            const hashedPassword = result[0].Password_client;
            const isPasswordMatch = bcrypt.compareSync(currentPassword, hashedPassword);
            if (isPasswordMatch) {
                const salt = bcrypt.genSaltSync(10);
                const hash = bcrypt.hashSync(newPassword, salt);
                const updatePasswordQuery = 'UPDATE client SET Password_client = ? WHERE Client_ID = ?';
                db.query(updatePasswordQuery, [hash, client_id], (err, result) => {
                    if (err) {
                        console.error('Error updating password:', err);
                        return res.status(500).json({ error: 'Internal Server Error' });
                    } else {
                        return res.status(200).json({ message: 'Password updated successfully' });
                    }
                });
            } else {
                return res.status(401).json({ error: 'Invalid current password' });
            }
        }
    });
}

export const update_admin_password = (req, res) => {
    const { admin_id, currentPassword, newPassword } = req.body;
    const getPasswordQuery = 'SELECT Password FROM admin WHERE admin_ID = ?';

    db.query(getPasswordQuery, [admin_id], (err, result) => {
        if (err) {
            console.error('Error fetching password:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        } else if (result.length === 0) {
            return res.status(404).json({ error: 'Admin not found' });
        } else {
            const hashedPassword = result[0].Password;
            const isPasswordMatch = bcrypt.compareSync(currentPassword, hashedPassword);
            if (isPasswordMatch) {
                const salt = bcrypt.genSaltSync(10);
                const hash = bcrypt.hashSync(newPassword, salt);
                const updatePasswordQuery = 'UPDATE admin SET Password = ? WHERE admin_ID = ?';
                db.query(updatePasswordQuery, [hash, admin_id], (err, result) => {
                    if (err) {
                        console.error('Error updating password:', err);
                        return res.status(500).json({ error: 'Internal Server Error' });
                    } else {
                        return res.status(200).json({ message: 'Password updated successfully' });
                    }
                });
            } else {
                return res.status(401).json({ error: 'Invalid current password' });
            }
        }
    });
}

export const add_admin = (req, res) => {
    const { adminId, password } = req.body;
    const hashedPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10)); // Hash the password

    const query = 'INSERT INTO admin (admin_ID, Password) VALUES (?, ?)';
    db.query(query, [adminId, hashedPassword], (err, result) => {
        if (err) {
            console.error('Error adding new admin:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        return res.status(200).json({ message: 'New admin added successfully.' });
    });
}
