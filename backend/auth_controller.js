import db from "./db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Client Registration
export const register = (req, res) => {
    const query = "SELECT * FROM Client WHERE Client_ID = ? OR phone_no = ? OR Email = ?";
    console.log(req.body);

    db.query(query, [req.body.Client_ID, req.body.phone_no, req.body.Email], (err, data) => {
        if (err) return res.json(err);
        if (data.length) {
            return res.status(409).json("User already exists");
        }
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(req.body.password, salt);
        const q = "INSERT INTO Client VALUES (?)";
        const v = [
            req.body.Client_ID,
            req.body.Client_Name,
            req.body.Email,
            req.body.phone_no,
            req.body.City,
            req.body.Pincode,
            req.body.Building,
            req.body.Floor_no,
            hash,
        ];
        db.query(q, [v], (err, data) => {
            if (err) return res.json(err);
            return res.status(200).json("User has been created.");
        });
    });
};

// Client Login
export const login_client = (req, res) => {
    const query = "SELECT * FROM Client WHERE Client_ID = ?";
    console.log(req.body);

    db.query(query, [req.body.Client_ID], (err, data) => {
        if (err) return res.json(err);
        if (data.length === 0) return res.status(404).json("User not found!");
        const isPasswordCorrect = bcrypt.compareSync(req.body.password, data[0].Password_client);
        if (!isPasswordCorrect) return res.status(400).json("Wrong ID or Password");
        const token = jwt.sign({ id: data[0].Client_ID }, "jwtkey");
        const { Password_client, ...other } = data[0];
        res.cookie("access_token", token, {
            httpOnly: true,
        }).status(200).json(other);
    });
};

// Client Logout
export const logout_client = (req, res) => {
    res.clearCookie("access_token", {
        sameSite: "none",
        secure: true,
    }).status(200).json("User has been logged out.");
};

// Admin Login
export const login_admin = (req, res) => {
    const query = "SELECT * FROM Admin WHERE Admin_ID = ?";
    console.log(req.body);

    db.query(query, [req.body.Admin_ID], (err, data) => {
        if (err) return res.json(err);
        if (data.length === 0) return res.status(404).json("User not found!");
        const isPasswordCorrect = bcrypt.compareSync(req.body.password, data[0].password);
        if (!isPasswordCorrect) return res.status(400).json("Wrong ID or Password");
        const token = jwt.sign({ id: data[0].Admin_ID }, "jwtkey");
        const { password, ...other } = data[0];
        res.cookie("access_token_admin", token, {
            httpOnly: true,
        }).status(200).json(other);
    });
};

// Admin Logout
export const logout_admin = (req, res) => {
    res.clearCookie("access_token_admin", {
        sameSite: "none",
        secure: true,
    }).status(200).json("Admin has been logged out.");
};

// Employee Login
export const login_employee = (req, res) => {
    const { Employee_ID, password } = req.body;

    // Validate input
    if (!Employee_ID || !password) {
        console.log("Missing Employee_ID or password in request body:", req.body);
        return res.status(400).json({ message: "Employee ID and password are required" });
    }

    const query = "SELECT * FROM Employee WHERE Employee_ID = ?";
    console.log("Attempting login for Employee ID:", Employee_ID);

    db.query(query, [Employee_ID], (err, data) => {
        if (err) {
            console.error("Database error during employee login:", err);
            return res.status(500).json({ message: "Internal server error" });
        }

        if (data.length === 0) {
            console.log("No employee found with ID:", Employee_ID);
            return res.status(404).json({ message: "Employee not found!" });
        }

        const employee = data[0];
        const isPasswordCorrect = bcrypt.compareSync(password, employee.Password_emp);
        if (!isPasswordCorrect) {
            console.log("Incorrect password for Employee ID:", Employee_ID);
            return res.status(400).json({ message: "Wrong ID or Password" });
        }

        const token = jwt.sign({ id: employee.Employee_ID }, "jwtkey", { expiresIn: '1h' });
        res.cookie("access_token_employee", token, {
            httpOnly: true,
            secure: true,
            sameSite: "Strict",
        }).status(200).json({ ...employee, Password_emp: undefined });
    });
};

// Employee Logout
export const logout_employee = (req, res) => {
    res.clearCookie("access_token_employee", {
        sameSite: "none",
        secure: true,
    }).status(200).json("Employee has been logged out.");
};
