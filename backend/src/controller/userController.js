const user = require("../models/userModel")
const nodemailer = require("nodemailer");
const jwt = require('jsonwebtoken');

const transporter = nodemailer.createTransport({
    service : "gmail",
    auth: {
    user: process.env.EMAIL_ID,
    pass: process.env.PASSWORD,
  },
});

const SignIn = async (req ,res)=>{

    try { 
        let isAdmin = false
        const {email , password} = req.body
        if(email === process.env.ADMIN){
            isAdmin= true
        }
        const Data = await user.create({ email, password });

        const token = jwt.sign({email},process.env.SECRET_KEY,{expiresIn : "1h"})
        return res.status(201).json({
            status: 'success',
            message: 'User created successfully',
            data: Data,
            "token": token,
            admin : isAdmin
        })     
    } catch (error) {
        console.log("error in creating user" , error)
        return res.status(500).json({
            status: 'error',
            message: 'Could not create user'})
    }

}

const Login = async (req ,res)=>{
    try { 
        const {email} = req.body
        const User = await user.findOne({ email });
        let isAdmin = false;
        if(!User) return res.status(404).json({message : "user not found"})
        const token = await jwt.sign({email}, process.env.SECRET_KEY,{expiresIn : "1h"})
        if(User.email === process.env.ADMIN) {
            isAdmin = true
        }
        return res.status(201).json({
            data: User,
            "token" : token,
            admin : isAdmin
        })     
    } catch (error) {
        console.log("error in creating user" , error)
        return res.status(500).json({message : error})
    }
}
function randomString(len = 8) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const max = chars.length;
  for (let i = 0; i < len; i++) {
    result += chars.charAt(Math.floor(Math.random() * max));
  }
  return result;
}

const ForgotPassword = async (req ,res)=>{
    try { 
        const email = req.body.email
        const User = await user.findOne({ email });
        if(!User) return res.status(404).json({message : "user not found"})
            User.password = randomString(8)
            await transporter.sendMail({
                from: "tyagiujjwal88@gmail.com",
                to : email,
                subject : "Your Password",
                text : `Your new password is ${User.password}`
            })
        return res.status(201).json({ message: 'If that email exists, instructions were sent.' })   
    } catch (error) {
        console.log("error in creating user" , error)
        return res.status(500).json({message : "unable to sned"})
    }
}

module.exports = {SignIn,Login,ForgotPassword}