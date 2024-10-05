const express = require('express');
const app = express();
const { query, validationResult, body, matchedData, checkSchema } = require('express-validator');
const { createUserValidationSchema } = require('./utils/validationSchemas');
const user = require('./routes/users')
const transaction = require('./routes/transactions')
const mongoose = require('mongoose');
const authJwt = require('./utils/jwt');
const { expressjwt } = require('express-jwt');
// const Redis = require('redis')
// const redisClient = Redis.createClient()

// const DEFAULT_EXPIRATION = 3600
require('dotenv').config();

app.use(express.json());
app.use(authJwt());
app.use('/api/v1', user)
app.use('/api/v1', transaction)
const PORT = process.env.PORT || 3000;

// // Connect to MongoDB
mongoose.connect(process.env.CONNECTION_STRING)
.then(() => {
    console.log('Database connection is ready');
})
.catch((error) => {
    console.error('Connection to MongoDB failed:', error);
});

app.listen(PORT, ()=> {
    console.log(`Running on Port ${PORT}`)
})


