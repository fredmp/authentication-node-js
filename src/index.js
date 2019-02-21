require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

const router = require('./router');

const { PORT, LOG_MODE, MONGO_URI, APP_DOMAIN } = process.env;

const corsHeaders = ['Authorization', 'Content-Type', 'Content-Length', 'X-Requested-With'];
const corsMethods = ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'];
const corsOptions = {
  origin: APP_DOMAIN,
  optionsSuccessStatus: 200,
  allowedHeaders: corsHeaders,
  exposedHeaders: corsHeaders,
  methods: corsMethods,
  preflightContinue: true,
  credentials: true,
};

const app = express();

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useCreateIndex: true });

app.use(morgan(LOG_MODE));
app.use(cors(corsOptions));
app.use(bodyParser.json());

router(app);

app.listen(PORT || 5000);
