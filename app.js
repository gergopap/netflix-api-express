'use strict';

var SwaggerExpress = require('swagger-express-mw');
var app = require('express')();
const swaggerSecurity = require('./api/helpers/swagger_security.js');
const mongoose = require('mongoose');

const config = {
  appRoot: __dirname,
  swaggerSecurityHandlers: swaggerSecurity.swaggerSecurityHandlers
};


SwaggerExpress.create(config, function (err, swaggerExpress) {
  if (err) { throw err; }

  // install middleware
  swaggerExpress.register(app);

  app.use(swaggerExpress.runner.swaggerTools.swaggerUi());

  var port = process.env.PORT || 10010;
  app.listen(port);

  mongoose.connect('mongodb://localhost/netflix', { useNewUrlParser: true });

  var db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error:'));
  db.once('open', function () {

  });
});

module.exports = {
  app/* ,
  db */
};
