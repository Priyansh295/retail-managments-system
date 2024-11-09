import mysql from "mysql2";

const db = mysql.createConnection({
    host: "localhost",
    user: "root", // Username
    password: "priyansh235689", // Your Password
    database: "inventory_db",
});

export default db;
