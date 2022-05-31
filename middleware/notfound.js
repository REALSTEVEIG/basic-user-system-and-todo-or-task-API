const {StatusCodes} = require('http-status-codes')
const notfoundMiddleware = (req, res) => {
    res.status(StatusCodes.NOT_FOUND).json({msg: `Page not found!`})
}

module.exports = notfoundMiddleware