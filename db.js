const mongoose = require('mongoose');

require('dotenv').config();

// Define the MongoDB connection URL
const mongoURL = process.env.MONGODB_URL_LOCAL // Replace 'mydatabase' with your database name
// const mongoURL = process.env.MONGODB_URL;

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