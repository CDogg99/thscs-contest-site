const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const config = require("../../config/config");
const userController = require("./users.controller");

router.post("/authenticate", (req, res)=>{
    let username = req.body.username;
    let password = req.body.password;
    if(!username || !password){
        return res.json({error: "Username or password not set"});
    }
    userController.getByUsername(username, (err, result)=>{
        if(err){
            return res.json({error: err.message});
        }
        if(!result){
            return res.json({error: "Invalid credentials"});
        }
        if(result.username == username && result.password == password){
            let userType = result.admin ? "admin" : "team";
            let payload = {
                _id: result._id,
                username: result.username,
                userType: userType
            };
            let options = {
                expiresIn: "1y"
            };
            jwt.sign(payload, config.jwt.secret, options, (err, token)=>{
                if(err){
                    return res.json({error: err.message});
                }
                res.json({token: token});
            });
        }
        else{
            return res.json({error: "Invalid credentials"});
        }
    });
});

router.put("/:_id", (req, res)=>{
    if(req.user === null){
        return res.json({error: "Not authorized"});
    }
    const _id = req.params._id;
    //teams may modify their division, school, and members' names
    if(req.user._id == _id){
        const update = {
            division: req.body.division,
            school: req.body.school,
            "members.m1.name": req.body.members.m1.name,
            "members.m2.name": req.body.members.m2.name,
            "members.m3.name": req.body.members.m3.name
        };
        userController.update(_id, update, (err, result)=>{
            if(err){
                return res.json({error: err.message});
            }
            if(result.modifiedCount == 1){
                res.json({success: true, message: "Updated 1 document"});
            }
            else{
                res.json({success: false, message: "Updated 0 documents"});
            }
        });
    }
    //admins may modify a team's written scores and coding score
    else if(req.user.admin){
        const update = {
            "members.m1.writtenScore": req.body.m1.writtenScore,
            "members.m2.writtenScore": req.body.m2.writtenScore,
            "members.m3.writtenScore": req.body.m3.writtenScore,
            codingScore: req.body.codingScore
        };
        userController.update(_id, req.body, (err, result)=>{
            if(err){
                return res.json({error: err.message});
            }
            if(result.modifiedCount == 1){
                res.json({success: true, message: "Updated 1 document"});
            }
            else{
                res.json({success: false, message: "Updated 0 documents"});
            }
        });
    }
    else{
        return res.json({error: "Not authorized"});
    }
});

router.get("/:username", (req, res)=>{
    if(req.user === null){
        return res.json({error: "Not authorized"});
    }
    const username = req.params.username;
    if(req.user.admin || (req.user.username == username)){
        userController.getByUsername(username, (err, result)=>{
            if(err){
                return res.json({error: err.message});
            }
            if(!result){
                res.json({error: "User not found"});
            }
            else{
                delete result.password;
                res.json({user: result});
            }
        });
    }
    else{
        return res.json({error: "Not authorized"});
    }
});



module.exports = router;