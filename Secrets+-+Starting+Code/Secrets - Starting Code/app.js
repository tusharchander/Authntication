//jshint esversion:6
// require('dotenv').config();
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
var passport = require('passport');
var session = require('express-session');
const passportLocalMongoose = require("passport-local-mongoose");


const app = express();
app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());

mongoose.connect("mongodb://127.0.0.1:27017/userDB");

const userSchema = new mongoose.Schema({
    username: String,
    password: String
});

userSchema.plugin(passportLocalMongoose);

const User = mongoose.model("User", userSchema);

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get('/', (req, res) => {
    res.render('home');
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.post("/login", (req, res) => {
    const username = req.body.username;
    const pass = (req.body.password);
    const user = new User({
        username: username,
        password: pass
    })

    req.login(user, function (err) {
        if (err) { res.redirect("/login"); }
        return res.redirect('/secrets');
    });

});

app.get('/register', (req, res) => {
    res.render('register');
});

app.post('/register', (req, res) => {

    User.register({ username: req.body.username, active: false }, req.body.password, function (err, user) {
        if (err) {
            res.redirect("/register");
        }
        passport.authenticate("local")(req, res, function () {
            res.redirect("/secrets");
        })
    });

});


app.get('/secrets', (req, res) => {
    if (req.isAuthenticated()) {
        res.render("secrets")
    }
    else {
        res.redirect("/login");
    }
});

app.get("/submit", (req, res) => {
    res.render("submit");
})

app.get('/logout', function (req, res, next) {
    req.logout(function (err) {
        if (err) { return next(err); }
        res.redirect('/');
    });
});

app.listen(3000, () => {
    console.log("Connection is live at port 3000");
});
