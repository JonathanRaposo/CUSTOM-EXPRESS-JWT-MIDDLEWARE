const express = require('express');
const logger = require('morgan');
const path = require('path');



module.exports = (app) => {
    app.use(logger('dev'));
    app.use(express.json());
    app.use(express.static(path.join(__dirname, '..', 'static-files')));
    app.set('views', path.join(__dirname, '..', 'views'));
    app.set('view engine', 'hbs');
}