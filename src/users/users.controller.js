const mongodb = require("mongodb").MongoClient;
const config = require("../../config/config");
const ObjectId = require("mongodb").ObjectId;

const userController = {

    getByUsername: (username, callback)=>{
        mongodb.connect(config.database.url, (err, db)=>{
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
        mongodb.connect(config.database.url, (err, db)=>{
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

    update: (_id, update, callback)=>{
        mongodb.connect(config.database.url, (err, db)=>{
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