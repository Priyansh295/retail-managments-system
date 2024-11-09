// app.js
import express from "express";
import cors from "cors";
import routes from "./routes.js";
import cookieParser from "cookie-parser";
import db from "./db.js"
import bodyParser from 'body-parser'

const app = express();
const port = 8800;

app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(bodyParser.json());
app.use("/", routes);

app.listen(port, () => {
    console.log("Server up and running @", port);
    console.log(`URL: http://localhost:${port}/`);
});