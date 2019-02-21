require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const router = require('./router');

const { PORT, LOG_MODE, MONGO_URI } = process.env;

const app = express();

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useCreateIndex: true });

app.use(morgan(LOG_MODE));
app.use(bodyParser.json());

router(app);

app.listen(PORT || 5000);
