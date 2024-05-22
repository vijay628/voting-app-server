const express = require('express');
const app = express();
const db = require('./db');
require('dotenv').config();
const cors = require('cors');



const bodyParser = require('body-parser');
app.use(bodyParser.json());

app.use(cors())

const uesrRoutes = require('./routes/userRoutes');
const candidateRoutes = require('./routes/candidateRoutes');
app.use('/user', uesrRoutes);
app.use('/candidate', candidateRoutes);


const PORT = process.env.PORT || 5555;
app.listen(PORT,function(){
console.log(`Your server is running on port: http://localhost:${PORT}`);
});