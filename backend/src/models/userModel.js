const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    email : {
        type: String,
        required : true,
        unique : true
    },
    password : {
        type: String,
        required : true,
    }
},{timestamps : true})

userSchema.pre('save',async function (next){
        if (!this.isModified('password')) return next();
    try {
        const SALT = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(this.password,SALT)
        this.password = hashPassword
        next()
    } catch (error) {
        next(error)
    }
})
userSchema.methods.isValidPassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};
const user = new mongoose.model('users',userSchema);

module.exports = user