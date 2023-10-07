const express = require("express");
const app = express();
const mongoose = require('mongoose');
const connectDb = require ('./src/config/database');
const bodyParser = require('body-parser');
require('dotenv').config();

// Connect to the database
connectDb();

//utils
app.use(bodyParser.urlencoded({ extended:false }));
app.use(bodyParser.json());

//routes declarations
const USER_ROUTES = require('./src/routes/user')
const BUDGET_ROUTES = require('./src/routes/budget')

//routes
app.use('/api', USER_ROUTES);
app.use('/api', BUDGET_ROUTES);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server started on PORT: ${PORT}`);
});