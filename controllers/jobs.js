const Job = require('../models/Job')
const {StatusCodes} = require('http-status-codes')
const {BadRequestError, NotFoundError} = require('../errors')

const getAllJobs = async (req, res) => {
    const jobs = await Job.find({createdBy: req.user.userId}).sort('createdAt')
    res.status(StatusCodes.OK).json({ jobs, count: jobs.length })
    //res.send('get all jobs')
}
const getJob = async (req, res) => {
    const {user: {userId}, params: { id: jobId }} = req //user object userID, nested destructuring, params from express id from routes/jobs, jobId to make sense
    
    const job = await Job.findOne({
        _id: jobId, createdBy: userId
    })
    if(!job) {
        throw new NotFoundError(`No job with id ${jobId}`)
    }
    res.status(StatusCodes.OK).json({ job })
    //res.send('get job')
}
const createJob = async (req, res) => {
    req.body.createdBy = req.user.userId //userId location, jobs model
    const job = await Job.create(req.body) //create new document from Job model
    res.status(StatusCodes.CREATED).json({ job })
    //res.json(req.body)
    //res.send('create job')
}
//updates job with _id
const updateJob = async (req, res) => {
    const {
        body: {company, position},
        user: {userId}, 
        params: { id: jobId }} = req //user object userID, nested destructuring, params from express id from routes/jobs, jobId to make sense
    //res.send('update job')
    if(company === '' || position === '') {
        throw new BadRequestError('Company or Position fields cannot be empty')
    }
    const job = await Job.findByIdAndUpdate({_id: jobId, createdBy: userId}, req.body, {new: true, runValidators: true}) //update req.body, new true for updated job, run validators
    if(!job) {
        throw new NotFoundError(`No job with id ${jobId}`)
    }
    res.status(StatusCodes.OK).json({ job })
}
const deleteJob = async (req, res) => {
    const {user: {userId}, params: { id: jobId }} = req //user object userID, nested destructuring, params from express id from routes/jobs, jobId to make sense
    
    const job = await Job.findByIdAndRemove({
        _id: jobId,
        createdBy: userId
    })
    if(!job) {
        throw new NotFoundError(`No job with id ${jobId}`)
    }
    res.status(StatusCodes.OK).send()
    //res.send('delete job')
}

module.exports = {
    getAllJobs,
    getJob,
    createJob,
    updateJob,
    deleteJob,
}