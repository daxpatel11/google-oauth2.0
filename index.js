const express = require('express');
const auth = require('./auth');
const app = express();
const passport = require('passport');
const session = require('express-session');

require('dotenv').config();

app.use(session({secret : 'secret'}));
app.use(passport.initialize());
app.use(passport.session());



app.get('/', (req,res) => {
    res.send('<a href="/auth/google">Authenticate with google</a>');
});

function isLoggedIn(req,res,next){
    req.user ? next() : res.sendStatus(401);
}

app.get('/auth/google', passport.authenticate('google' , {scope : ['email' , 'profile']})
)

app.get('/google/callback',
    passport.authenticate('google',{
        successRedirect : '/protected',
        failureRedirect : '/auth/failure',

    }))

app.get('/auth/failure',(req,res) => {
    res.send('something went wrong');
})

app.get('/protected',isLoggedIn,(req,res) => {
    res.send(`Hello ${req.user.displayName}`);
})

app.get('/logout', (req,res) => {
    req.logout();
    req.session.destroy();
    res.send('Good Bye');
})

app.listen(5000,() => console.log('app is runing'));