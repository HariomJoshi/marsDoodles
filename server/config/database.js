const mongoose = require('mongoose');
require('dotenv').config();

exports.connect = () => {
    mongoose.connect(process.env.MONGODB_URL,{
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(console.log("DB connection SUCCESSFUL"))
    .catch((error) => {
        console.log("ERROR connecting to the database");
        process.exit(1);
    })
}