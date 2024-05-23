const mongoose = require('mongoose');

require('dotenv').config();

// MongoDB connection URL local anfd online it will connect to local if online not available
// const mongoURL = process.env.MONGODB_URL_LOCAL || process.env.MONGODB_URL_ONLINE ;
const MONGODB_USER = encodeURIComponent(process.env.MONGODB_USER);
const MONGODB_PASSWORD = encodeURIComponent(process.env.MONGODB_PASSWORD);
const CLUSTER_NAME = process.env.CLUSTER_NAME;

const MONGODB_URI = `mongodb+srv://${MONGODB_USER}:${MONGODB_PASSWORD}@${CLUSTER_NAME}/?retryWrites=true&w=majority&appName=VotingApp`;

// Connect to the MongoDB database
mongoose.connect(MONGODB_URI,{
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