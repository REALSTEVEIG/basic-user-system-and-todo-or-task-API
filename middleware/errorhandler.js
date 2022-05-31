const { StatusCodes } = require('http-status-codes')
const errorHandlerMiddleware = (err, req, res, next) => {
   let customError = {
       statusCode : err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
       msg : err.message || `Something is wrong with our server, please try again later!`
   }

   if (err.name === 'ValidationError') {
       customError.msg = Object.values(err.errors).map((item) => item.message).join(',')
       customError.statusCode = 400
   }

   if (err.code && err.code === 11000) {
       customError.msg = `Matching ${Object.keys(err.keyValue)} already exists in our database. Please provide a new ${Object.keys(err.keyValue)} or login with existing ${Object.keys(err.keyValue)}`
       customError.statusCode = 400
   }

   if (err.name === 'CastError') {
       customError.msg = `No item with id ${err.value} in our database`
       customError.statusCode = 404
   }
   console.log(err)
   return res.status(customError.statusCode).json({msg : customError.msg})
}

module.exports = errorHandlerMiddleware
