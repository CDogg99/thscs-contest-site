const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const path = require("path");
const routers = require("./src/routers");

const config = require("./config/config");

const app = express();

app.use(express.static(path.join(__dirname, "public")));

app.use(cors());
app.use(bodyParser.json());
app.use((req, res, next)=>{
    const token = req.header("authorization");
    if(token){
        //verify token, pull user data, and set it equal to req.user
    }
    else{
        req.user = null;
    }
    next();
});

app.use("/api/users", routers.userRouter);

const port = process.env.PORT || 3000;
app.listen(port, ()=>{
    console.log("Server running on port " + port);
});