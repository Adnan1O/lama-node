const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const fileSchema = new Schema({
    tabName: {
        type: String,
        required: true
    },
    fileName: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    dateAdded: {
        type: Date,
        default: Date.now
    }
});

const project = new Schema({
    user:{
        type:String,
        require:true
    },
    title:{
        type:String,
        require:true
    },
    files: [fileSchema]
})

const Project = mongoose.model('project',project );
module.exports =  Project