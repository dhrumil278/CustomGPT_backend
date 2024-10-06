// require all the packages
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
// init the app
const app = express();

// middleware
app.use(express.json({ limit: '30mb', extended: true }));
app.use(express.urlencoded({ limit: '30mb', extended: true }));
app.use(cors());

// Requiring the routes

// User Auth routes
const userAuth = require('./routes/user/userAuth');
app.use('/user', userAuth);

// Vectors routes
// const vectors = require('./routes/vector/vectorsRoutes');
// app.use('/vectors', vectors);

// ChatBot routes
// const chatBot = require('./routes/chatBot/chatBotRoutes');
// app.use('/chatBot', chatBot);

// set the port
const port = process.env.PORT || 8080;

mongoose.connect(`${process.env.MONGO_URL}`);

// listen the port
app.listen(port, () => {
  console.log(`server is running on port  : ${port}`);
});
