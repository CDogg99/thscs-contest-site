const ObjectId = require("mongodb").ObjectId;
const mongo = require("../mongo");

const userController = {

    getByUsername: (username, callback)=>{
        mongo.getConnection((err, db)=>{
            if(err){
                return callback(err, null);
            }
            db.collection("users", (err, collection)=>{
                if(err){
                    return callback(err, null);
                }
                collection.findOne({username: username}, (err, result)=>{
                    if(err){
                        return callback(err, null);
                    }
                    callback(null, result);
                });
            });
        });
    },

    getById: (_id, callback)=>{
        mongo.getConnection((err, db)=>{
            if(err){
                return callback(err, null);
            }
            db.collection("users", (err, collection)=>{
                if(err){
                    return callback(err, null);
                }
                collection.findOne({_id: new ObjectId(_id)}, (err, result)=>{
                    if(err){
                        return callback(err, null);
                    }
                    callback(null, result);
                });
            });
        });
    },

    getAllUsers: (callback)=>{
        mongo.getConnection((err, db)=>{
            if(err){
                return callback(err, null);
            }
            db.collection("users", (err, collection)=>{
                if(err){
                    return callback(err, null);
                }
                collection.find({}, {password: false}).toArray((err, result)=>{
                    if(err){
                        return callback(err, null);
                    }
                    callback(null, result);
                });
            });
        });
    },

    update: (_id, update, callback)=>{
        mongo.getConnection((err, db)=>{
            if(err){
                return callback(err, null);
            }
            db.collection("users", (err, collection)=>{
                if(err){
                    return callback(err, null);
                }
                collection.updateOne({_id: new ObjectId(_id)}, {$set: update}, (err, result)=>{
                    if(err){
                        return callback(err, null);
                    }
                    callback(null, result);
                });
            });
        });
    }

};

module.exports = userController;