const mongoose = require('mongoose')

const TodoSchema = new mongoose.Schema({
    task: {
        type: String,
        required: [true, 'Pleased provide a task!'],
      },
    completed: {
        type: Boolean,
        required : [true, 'Have you completed this task?']
      }
}, {timestamps : true})

module.exports = mongoose.model('Todo', TodoSchema)