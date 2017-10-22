const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const mongodb = require("mongodb").MongoClient;
const config = require("../../config/config");

router.post("/authenticate", (req, res)=>{
    let username = req.body.username;
    let password = req.body.password;
    if(!username || !password){
        res.json({error: "Username or password not set"});
        return;
    }
    mongodb.connect(config.database.url, (err, db)=>{
        if(err){
            res.json({error: err.message});
            return;
        }
        db.collection("users", (err, collection)=>{
            if(err){
                res.json({error: err.message});
                return;
            }
            collection.findOne({username: username}, (err, result)=>{
                if(err){
                    res.json({error: err.message});
                    return;
                }
                if(!result){
                    res.json({error: "User not found"});
                    return;
                }
                if(result.username == username && result.password == password){
                    let userType = result.admin ? "admin" : "team";
                    let payload = {
                        _id: result._id.str,
                        username: result.username,
                        userType: userType
                    };
                    let options = {
                        expiresIn: "1y"
                    };
                    jwt.sign(payload, config.jwt.secret, options, (err, token)=>{
                        if(err){
                            res.json({error: err.message});
                            return;
                        }
                        res.json({token: token});
                    });
                }
                else{
                    res.json({error: "Invalid credentials"});
                    return;
                }
            });
        });
    });
});

module.exports = router;