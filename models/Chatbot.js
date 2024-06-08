const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const chatbotSchema = new Schema({
    project:{
        type: Schema.Types.ObjectId,
        ref: 'Project',
    },
    name:{
        type: String,
    },
    welcomeMessage:{
        type: String,
    },
    inputPlaceholder:{
        type: String,
    },
    primaryColor:{
        type: String,
    },
    fontColor:{
        type: String,
    },
    fontSize:{
        type: String,
    },
    chatHeight:{
        type: String,
    },
    showSources:{
        type: Boolean,
        default:false
    },
    iconSize:{
        type: String,  
    },
    iconPosition:{
        type: String,
    },
    distanceFromBottom:{
        type: String,
    },
    horizontalDistance:{
        type: String,
    },
    image:{
        type: String,
    }

})
const Chatbot = mongoose.model('chatbotSchema',chatbotSchema );
module.exports =  Chatbot