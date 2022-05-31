const bcrypt = require('bcryptjs')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')

const authSchema = new mongoose.Schema({
    name : {
        type : String,
        required : [true, 'Please provide a name!'],
        minlength : [5, 'username is too short!'], 
        maxlength : 50,
        unique : true
    },
    password : {
        type : String,
        required : [true, 'Please provide a password!'],
        minlength : [5, 'Password is too short!'],
        maxlength : 50
    },

    email : {
        type : String,
        required : [true, 'Please provide a password!'],
        match : [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            'Please provide a valid email',
        ],
        unique : true
    }
}, {timestamps : true})


authSchema.pre('save', async function () {
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
})

authSchema.methods.getName = function () {
    return this.name
}

authSchema.methods.createJWT = function () {
    return jwt.sign({usrId : this._id, name : this.name },process.env.JWT_SECRET,{expiresIn:process.env.JWT_LIFETIME})
}

authSchema.methods.comparePassword = async function (candidatePassword) {
    const isMatch = await bcrypt.compare(candidatePassword, this.password)
    return isMatch
}

module.exports = mongoose.model('Auth', authSchema)