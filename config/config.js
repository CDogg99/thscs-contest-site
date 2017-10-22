const f = require("util").format;

const config = {
    database: {
        url: f("mongodb://%s:%s@localhost:27017/thscontest?authMechanism=%s", encodeURIComponent("root"), encodeURIComponent("root"), "DEFAULT"),
        username: "root",
        password: "root"
    },
    jwt: {
        secret: "4HyLu51RitaFIwBa"
    }
};

module.exports = config;