const mongodb = require("mongodb").MongoClient;
const config = require("../config/config");

mongodb.connect(config.database.url, (err, database)=>{
    if(err) throw err;
    database.collection("users", (err, collection)=>{
        if(err) throw err;
        let numTeams = 100;
        let generatedTeams = [];
        for(let i = 0; i < numTeams; i++){
            let username = "team" + (i+1);
            let password = generatePassword();
            let division = null; //advanced or novice
            let school = null;
            let members = {
                m1: {
                    name: null,
                    writtenScore: null
                },
                m2: {
                    name: null,
                    writtenScore: null
                },
                m3: {
                    name: null,
                    writtenScore: null
                }
            };
            let codingScore = null;
            let team = {
                username,
                password,
                division,
                school,
                members,
                codingScore
            };
            generatedTeams.push(team);
        }
        collection.insertMany(generatedTeams, (err, result)=>{
            if(err) throw err;
            console.log("Inserted " + result.insertedCount + " teams");
            process.exit();
        });
    });
});

function generatePassword(){
    const selection = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890";
    let password = "";
    const length = 10;
    for(let i = 0; i < length; i++){
        let index = Math.random() * (selection.length);
        let char = selection.charAt(index);
        password += char;
    }
    return password;
}