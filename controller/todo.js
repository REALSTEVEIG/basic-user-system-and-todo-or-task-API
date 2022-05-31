const Todo = require('../models/todo')
const { StatusCodes } = require("http-status-codes")
const { BadRequestAPIError, UnauthenticatedAPIError } = require('../errors')

exports.createTask = async (req, res) => {
   const newTask = await Todo.create(req.body)
   res.status(StatusCodes.CREATED).json({newTask})
}

exports.getAllTasks = async (req, res) => {
    const allTasks = await Todo.find({})
    res.status(StatusCodes.OK).json({allTasks, count : allTasks.length})
}

exports.getSingleTask = async (req, res) => {
    const {id : taskId} = req.params
    const user = await Todo.findOne({_id : taskId})
    if (!user) {
        throw new BadRequestAPIError(`No task with id ${taskId}`)
    }

    return res.status(StatusCodes.OK).json({user})
}

exports.updateTask = async (req, res) => {
    const {id : taskId} = req.params
    const editTask = await Todo.findByIdAndUpdate({_id : taskId}, req.body, {new : true, runValidators : true})
    if (!editTask) {
        throw new BadRequestAPIError(`No task with id ${taskId}`)
    }
    return res.status(StatusCodes.OK).json({editTask})
}

exports.deleteTask = async (req, res) => {
    const {id : taskId} = req.params
    const removeTask = await Todo.findByIdAndDelete({_id : taskId})
    if (!removeTask) {
        throw new BadRequestAPIError(`No task with id ${taskId}`)
    }
    return res.status(StatusCodes.OK).json({msg : `Deleted Successfully!`})
}