//jshint esversion:6
require('dotenv').config();
const encrypt = require("mongoose-encryption");
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();
app.use(express.static("public"));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));



mongoose.connect("mongodb://127.0.0.1:27017/userDB");
const userSchema =new mongoose.Schema( {
    email:String,
    password:String
});


userSchema.plugin(encrypt,{secret:process.env.SECRET,encryptedFields:['password']});

const User = mongoose.model("User",userSchema);

User.find().then((user)=>{
    console.log(user);
})

app.get('/',(req,res)=>{
    res.render('home');
});

app.get('/login',(req,res)=>{
    res.render('login');
});

app.post("/login",(req,res)=>{
    const email = req.body.username;
    const pass = req .body.password;

    User.findOne({email:email}).then((user)=>{
        if(user.password === pass){
            console.log("user found!");
            res.redirect("/secrets");
        }
        else{
            console.log("No user found!");
            res.redirect('/login');
        }
    });
    
});

app.get('/register',(req,res)=>{
    res.render('register');
});

app.post('/register',(req,res)=>{
    const email = req.body.username;
    const pass = req .body.password;
    if(email!="" && pass!=""){
        const user = new User({
            email:email,
            password:pass
        });
        user.save().then((user)=>{
            console.log("User succesfully added",user);
            
        });
    }
    res.redirect("/");
});


app.get('/secrets',(req,res)=>{
    res.render("secrets");
});

app.get("/submit",(req,res)=>{
    res.render("submit");
})
app.post("/submit",(req,res)=>{
    
})

app.listen(3000,()=>{
    console.log("Connection is live at port 3000");
});
