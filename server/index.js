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
const user = require("./routes/user");
app.use("/api/v1",user);

// Activate server
app.listen(PORT, () => {
    console.log(`marsDoodles is live at ${PORT}`)
})