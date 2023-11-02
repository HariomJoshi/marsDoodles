// Create app
const express = require('express');
const app = express();

// set PORT
require('dotenv').config();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(express.json());

// Connect to DB
const db = require("./config/database");
db.connect();

// Mount API

// Activate server
app.listen(PORT, () => {
    console.log(`marsDoodles is live at ${PORT}`)
})