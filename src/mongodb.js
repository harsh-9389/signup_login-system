const mongoose = require("mongoose")
// const session = require('express-session'); 
// const passport = require("passport"); 
// const passportLocalMongoose = require("passport-local-mongoose"); 


//// Setting Up the MongoDB Connection 
mongoose.set('strictQuery', true);

mongoose.connect("mongodb://127.0.0.1:27017/hack_36")
.then(()=>{
    console.log("mongodb connected"); 
})
.catch(()=>{
    console.log("failed to connect");
})
///////////////////

//// Creating UserSchema 
const userSchema = mongoose.Schema({
    name: {type: String, required: true}, 
    email: {type: String, rquired: true, unique: true}, 
    password: {type: String, rquired: true} ,
}, {timeStamps: true})
///////////////////////

const collection = new mongoose.model("users", userSchema);   

// secret ='Thisisoulittlesecret.'
// userSchema.plugin(passportLocalMongoose) ;
// userSchema.plugin(encrypt, {secret: secret, encryptedFields: ["password"]}); 
// userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ["password"]}); 

// passport.use(collection.createStrategy()); 
// passport.serializeUser(collection.serializeUser()); 
// passport.deserializeUser(collection.deserializeUser()); 

module.exports = collection