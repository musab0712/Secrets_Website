require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const md5 = require("md5");
//const encrypt = require("mongoose-encryption");

const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
    extended: true
}));

mongoose.connect('mongodb://127.0.0.1:27017/SecretsDB');

const secretsSchema = new mongoose.Schema({
    email: String,
    pswd: String
});

//secretsSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ["pswd"]});

const User = mongoose.model('User', secretsSchema);

app.get("/", (req, res)=>{
    res.render("home");
});
app.get("/login", (req, res)=>{
    res.render("login");
});
app.get("/register", (req, res)=>{
    res.render("register");
});

app.post("/register", (req, res)=>{
    const newUser = new User({
        email: req.body.username,
        pswd: md5(req.body.password)
    });
    newUser.save();
    res.render("secrets");

});
app.post("/login" , (req, res) => {
    const username = req.body.username;
    const pswd = md5(req.body.password);
    User.findOne({email: username}).exec()
    .then(userFound =>{
        if(userFound.email === username){
            if(userFound.pswd === pswd){
                res.render("secrets");
                console.log("success log IN");
            }
            else console.log("pswd wrong");
        }
    })
    .catch((err) =>{
        //console.error(err);
        console.log("user not found");
    });
});

app.listen(3000, ()=>{
    console.log("Server started on port 3000.");
});