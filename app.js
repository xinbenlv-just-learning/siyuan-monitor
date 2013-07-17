
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , l = require('tracer').colorConsole()
  , mongoose = require('mongoose');

l.info('Start.');

var app = express();

mongoose.connect(process.env.MONGOHQ_DEV_URL, function(err) {
  if(err ) l.info('Failed: ' + JSON.stringify(err));
  else l.info('Connected to MG');
});


app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('your secret here'));
  app.use(express.session());
  app.use(app.router);
  app.use(require('less-middleware')({ src: __dirname + '/public' }));
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function() {
  app.use(express.errorHandler());
});

app.get('/', routes.index);
app.get('/users', user.list);

http.createServer(app).listen(app.get('port'), function() {
  l.info("Express server listening on port " + app.get('port'));
});
//--------------------------------------------------------------------------------------------
var Schema = mongoose.Schema;
var HitResultSchema = new Schema({
  timestamp: Date,
  matcher: String,
  url: String,
  result: String,
  statusCode: Number
});

/**
 *
 * @type {User} a model of user
 */
 var HitResult = mongoose.model('HitResult', HitResultSchema);

var hitUrl = 'http://www.google.com';
var matcher = /google\.com/;
var request = require('request');
var period = 2000;

var roc = function(cb) {
  l.info('Start count');
  setTimeout(function() {
    request(hitUrl, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        l.info((body.match(matcher)) == null); // Print the google web page.
        var hr = new HitResult({
          timestamp: new Date(),
          matcher: matcher,
          url: hitUrl,
          result: ((body.match(matcher)) != null),
          statusCode: response.statusCode
        });
        hr.save();
        return;
      } else {
        var hr = new HitResult({
          timestamp: new Date(),
          matcher: matcher,
          url: hitUrl,
          result: ((body.match(matcher)) != null),
          statusCode: response.statusCode
        });
        hr.save();
      }
      return;
    });
  roc();
  }, period);
};

roc();

