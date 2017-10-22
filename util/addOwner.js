const mongodb = require("mongodb").MongoClient;
const config = require("../config/config");

//Requires mongod to run without authentication enabled
mongodb.connect("mongodb://localhost:27017/thscontest", (err, database)=>{
    if(err) return err;
    database.addUser(config.database.username, config.database.password, {roles: [{role: "dbOwner", db: "thscontest"}]}, (err, result)=>{
        if(err) return err;
        console.log("Database owner created");
        process.exit();
    });
});