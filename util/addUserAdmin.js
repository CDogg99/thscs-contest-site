const mongodb = require("mongodb").MongoClient;
const config = require("../config/config");

mongodb.connect(config.database.url, (err, db)=>{
    if(err) throw err;
    db.collection("users", (err, collection)=>{
        if(err) throw err;
        const admin = {
            username: "admin",
            password: "admin",
            admin: true
        }
        collection.insertOne(admin, (err, result)=>{
            if(err) throw err;
            console.log("Inserted " + result.insertedCount + " admin");
            process.exit();
        });
    });
});