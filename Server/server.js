const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

mongoose.connect(
  process.env.MONGODB_URI,
)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('Connection error', err));

const userRoutes = require('./route/userRoute');
app.use('/users', userRoutes);

const employeeRoute = require('./route/employeeRoute');
app.use('/employees',employeeRoute);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
