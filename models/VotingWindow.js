const mongoose = require('mongoose');

const votingWindowSchema = new mongoose.Schema({
    votingType:{
        type:String,
        required:true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    }
});

const VotingWindow = mongoose.model('VotingWindow', votingWindowSchema);
module.exports = VotingWindow;
