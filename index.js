require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');

const { PORT, LOG_MODE } = process.env;

const app = express();

app.use(morgan(LOG_MODE));
app.use(bodyParser.json({ type: 'application/*+json' }));

app.listen(PORT || 3000);
