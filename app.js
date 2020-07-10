const express = require('express');
const router = require('./routes/routes.js');

const app = express();

app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.use(router);

module.exports = app;