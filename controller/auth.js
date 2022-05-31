const Auth = require('../models/auth')
const { StatusCodes } = require("http-status-codes")
const { BadRequestAPIError, UnauthenticatedAPIError } = require('../errors')

exports.register = async (req, res) => {
   const newUser = await Auth.create({...req.body})
   const token = newUser.createJWT()
   res.status(StatusCodes.CREATED).json({newUser : {name : newUser.name}, token})
}

exports.login = async (req, res) => {
   const {email, password} = req.body
   if (!email || !password) {
       throw new BadRequestAPIError('Please provide email and password!')
   }
   const user = await Auth.findOne({email}) 

   if (!user)  {
       throw new UnauthenticatedAPIError('Email does not exist')
   }

   const isPasswordCorrect = await user.comparePassword(password)

   if (!isPasswordCorrect) {
       throw UnauthenticatedAPIError('Password is incorrect!')
   }

   const token = await user.createJWT()
   res.status(StatusCodes.OK).json({user : {name : user.name}, token})
}
