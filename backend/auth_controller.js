import db from "./db.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

export const register = (req, res) => {
    // Check if client exists
    const query = "SELECT * FROM Client WHERE \
     Client_ID = ? OR phone_no = ? OR Email = ?"
    console.log(req.body)

    db.query(query, [req.body.Client_ID, req.body.phone_no, req.body.Email],
        (err, data) => {
            if(err) return res.json(err)
            if(data.length) {
                // console.log(data, data.length)
                return res.status(409).json("User already exists")
            }
            console.log(req.body)
            const salt = bcrypt.genSaltSync(10);
            const hash = bcrypt.hashSync(req.body.password, salt);
            const q = "INSERT INTO Client VALUES (?)"
            const v = [
                req.body.Client_ID,
                req.body.Client_Name,
                req.body.Email,
                req.body.phone_no,
                req.body.City,
                req.body.Pincode,
                req.body.Building,
                req.body.Floor_no,
                hash
            ]
            console.log(v)
            db.query(q, [v], (err, data) => {
                if(err) return res.json(err);
                return res.status(200).json("User has been created.");
            })
        })
}
export const login_client = (req, res) => {
    const query = "SELECT * FROM Client WHERE \
     Client_ID = ?"
    console.log(req.body)
    db.query(query, [req.body.Client_ID], (err, data) => {
        if (err) return res.json(err);
        console.log(data)
        if(data.length === 0) return res.status(404).json("User not found!");
        const isPasswordCorrect = bcrypt.compareSync(req.body.password, data[0].Password_client);
        if(!isPasswordCorrect) return res.status(400).json("Wrong ID or Password")
        const token = jwt.sign({id:data[0].Client_ID}, "jwtkey");
        const {password, ...other} = data[0]
        res.cookie("access_token", token, {
            httpOnly: true
        }).status(200).json(other);
    })
}
export const logout_client = (req, res) => {
    res.clearCookie("access_token", {
        sameSite: "none",
        secure: true}
    ).status(200).json("User has been logged out.")
}
export const login_admin = (req, res) => {
    const query = "SELECT * FROM Admin WHERE \
     Admin_ID = ?"
    console.log(req.body)
    db.query(query, [req.body.Admin_ID], (err, data) => {
        if (err) return res.json(err);
        console.log(data)
        if(data.length === 0) return res.status(404).json("User not found!");
        const isPasswordCorrect = bcrypt.compareSync(req.body.password, data[0].password);
        if(!isPasswordCorrect) return res.status(400).json("Wrong ID or Password")
        const token = jwt.sign({id:data[0].Admin_ID}, "jwtkey");
        const {password, ...other} = data[0]
        res.cookie("access_token_admin", token, {
            httpOnly: true
        }).status(200).json(other);
    })
}
export const logout_admin = (req, res) => {
    res.clearCookie("access_token_admin", {
        sameSite: "none",
        secure: true}
    ).status(200).json("Admin has been logged out.")
}