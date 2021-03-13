require('dotenv').config();
const express = require ("express");
const ejs = require ("ejs");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
// const encrypt = require('mongoose-encryption');
// const md5 = require('md5');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const app = express();


app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(express.urlencoded({extended:true}));
mongoose.connect('mongodb://localhost/authDB', {useNewUrlParser: true, useUnifiedTopology: true});
const userSchema = new mongoose.Schema({
    name: String,
    password: String
  });

// const secret = process.env.SECRET;
// userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ["password"] });

const User = mongoose.model("User",userSchema);

 
app.get("/", (req,res) =>{
    res.render("home");
});
app.get("/login", (req,res) =>{
    res.render("login");
});
app.get("/register", (req,res) =>{
    res.render("register");
});

app.post("/register", (req,res) =>{
    bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
        const newUser = new User({
            name: req.body.username,
            password: hash
        });
        newUser.save((err) =>{
            if (err) throw err
            res.render("secrets")
        })
    })
})

app.post("/login", (req,res) =>{
    const username = req.body.username;
    const password = req.body.password;
    User.findOne({name: username}, (err, foundUser) =>{
        if (err) throw err;
        else { if (foundUser) {
            bcrypt.compare(password, foundUser.password, function(err, result) {
            if (result == true){
                res.render("secrets");  // to http://localhost:3000/login but with secrets page 
                // res.redirect("/register"); to http://localhost:3000/register
            } else{
                res.send ("Your password is not matched, please try again!")
            }
            })}
        }
    })
})



app.listen(3000, () => console.log("server is running on the port 3000"));
