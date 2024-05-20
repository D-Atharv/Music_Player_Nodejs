//database connection
const mongoose = require('mongoose');
const connect = mongoose.connect("mongodb://127.0.0.1:27017/Login-tut");


//checking database connected or not
connect
    .then(() => {
        console.log("Database Connected successfully");
    })
    .catch((err) => {
        console.log("Database couldn't be connected. Error:", err.message);
    });


//creating a schema
const LoginSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
})

//collection part
const collection = new mongoose.model("users", LoginSchema);

module.exports = collection;
