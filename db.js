const mongoose = require('mongoose');

require('dotenv').config();

// MongoDB connection URL local anfd online it will connect to local if online not available
const mongoURL = process.env.MONGODB_URL_LOCAL || process.env.MONGODB_URL_ONLINE ;

// Connect to the MongoDB database
mongoose.connect(mongoURL,{
    useNewUrlParser:true,
    useUnifiedTopology:true
})

const db = mongoose.connection;

db.on('connected',()=>{
    console.log('MongoDB sever connected successfully');
})

db.on('error',(err)=>{
    console.error('MongoDB connection error', err);
})
db.on('disconnected',()=>{
    console.log('MongoDB server disconnected !!');
})

module.exports = db;