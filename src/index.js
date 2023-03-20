// require('dotenv').config(); 
const express = require('express'); 
const path = require("path")
const ejs = require("ejs");
const session = require('express-session'); 
const passport = require("passport"); 
const md5 = require('md5'); 
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt'); 
const flash =  require('connect-flash'); 
// const passportLocalMongoose = require("passport-local-mongoose");
const app =express();

//Setting Up the template engine 
app.use(express.json())
app.set("view engine", "ejs")
const templatePath = path.join(__dirname, '../tempelates')
app.set("views", templatePath)
app.use(bodyParser.urlencoded({extended:true}));
////////////////////

// SettingUp static files
const css = path.join(__dirname, '../public/css')
const img = path.join(__dirname, '../public/img')
const js = path.join(__dirname, '../public/js')

app.use(express.static(css))
app.use(express.static(img))
app.use(express.static(js))
//////////////////////////

//Setting Up sessions
app.use(session({
    secret: "our little secret.", 
    resave: true, 
    saveUninitialized: true
})); 

app.use(flash());

app.use(passport.initialize());
app.use(passport.session());  
////////////////

const collection = require("./mongodb")    //MongoDB File 

//Routs Connection 
app.get("/", (req,res)=>{
    res.render("home")
})

app.get("/login", (req,res)=>{
    res.render("login")
})

app.get("/signup", (req,res)=>{
    res.render("signup")
})
///////////////////

///signUp Post Request 
app.post("/signup", async(req, res)=>{
    const {name, email, password, confirm_password} = req.body
    const check = await collection.findOne({email: email})

    ////checking Email is not duplicate
    if(check){
        res.send('Email allready exists.')
    //     req.flash('error', 'Email Allready in Use.')
    //     res.redirect('/signup')
    }

    ////// Checking Password meets requirments 
    const lower = /[a-z]/;
    const upper  =/[A-Z]/;
    const number = /[0-9]/;
    const special = /['@', '#', '$', '&', '!', '%', '^']/;

    if(password.length < 8 || !lower.test(password) || !number.test(password) || !upper.test(password) || !special.test(password)) {
        if(password.length<8){
            res.send("Please make sure password is longer than 8 characters.")
        }
        if(!lower.test(password)){
            res.send("Please make sure password includes a lowercase letter.")
        }
        if(!number.test(password)){
            res.send("Please make sure Password Includes a Digit")     
        }
        if(!upper.test(password)) {
            res.send("Please make sure password includes an uppercase letter.");
        }
        if(!special.test(password)){
            res.send('Please make sure password contains a special character');
        }
    }

    //// Confirm Password checkin
    if(password === confirm_password){
        const hashedPassword = await bcrypt.hash(password, 10)
        // const hashConf_password = bcrypt.hash(confirm_password, 10)
    
        const data= new collection({
            name:name, 
            email:email,
            password:hashedPassword,
            // confirm_password: hashConf_password
        });
        
        data.save(function(err){
            if(err){
                console.log(err); 
            }
            else{
                res.send('you have been resistered successfully');
            }
        });
    }

    else{
        res.send('Both the passwords should be same.....')
        // req.flash('error', 'Both the passwords should be same')
        // res.redirect('/signup')
    }
});
/////////////////////////

///// Login Post Request
app.post("/login", async(req, res)=>{
   
    const {email, password} = req.body 
    const check= await collection.findOne({email:email})
    
    try{
        const match = await bcrypt.compare(password, check.password)

        if(match){
            req.flash('success', 'Successfully loged in....')
            res.redirect('/'); 
        }
        else{
            res.send('wrong details')
        }
    }

    catch{
        res.send("Email Adress is Wrong.")
    }
});
//////////////////////////////

/////Server Connection 
const port =process.env.PORT || 3000;
app.listen(port, ()=>{
    console.log(`port is running at ${port}`)
}); 
////////////////////