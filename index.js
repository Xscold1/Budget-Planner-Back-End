const express = require("express");
const app = express();
const mongoose = require('mongoose');
const connectDb = require ('./src/config/database');
const bodyParser = require('body-parser');
require('dotenv').config();

// Connect to the database
connectDb();

app.use(bodyParser.urlencoded({ extended:false }));
app.use(bodyParser.json());

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server started on PORT: ${PORT}`);
});