const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const user = new Schema({
    email:{
        type:String,
        require:true
    },
    userName:{
        type:String,

    }
})

const User = mongoose.model('user',user );
module.exports =  User