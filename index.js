const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const path = require("path");
const routers = require("./src/routers");
const config = require("./config/config");
const userController = require("./src/users/users.controller");

const app = express();

app.use(express.static(path.join(__dirname, "public")));

app.use(cors());
app.use(bodyParser.json());
app.use((req, res, next)=>{
    const token = req.header("authorization");
    if(token){
        jwt.verify(token, config.jwt.secret, (err, payload)=>{
            if(err){
                req.user = null;
                next();
            }
            else{
                userController.getByUsername(payload.username, (err, result)=>{
                    if(err){
                        req.user = null;
                        next();
                    }
                    else{
                        req.user = result;
                        next();
                    }
                });
            }
        });
    }
    else{
        req.user = null;
        next();
    }
});

app.use("/api/users", routers.userRouter);

const port = process.env.PORT || 3000;
app.listen(port, ()=>{
    console.log("Server running on port " + port);
});