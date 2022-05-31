const mongoose = require('mongoose')

const connectDB = (url) => {
    return new mongoose.connect(url, {
        usenewUrlParser : true,
        useUnifiedTopology : true
    })
}


module.exports = connectDB