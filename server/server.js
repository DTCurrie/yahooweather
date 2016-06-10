// ----- Modules
var express = require("express"),
    cors = require("cors"),
    bodyParser = require("body-parser"),
    methodOverride = require('method-override'),
    app = express(),
    config = require('./config.json'),
    port = process.env.PORT || config.port,    // Port
    server = require('http').createServer(app),
    path = require('path'),
    publicPath = path.join(__dirname, config.publicPath);

// ----- Configure Modules
app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.json({type: 'application/vnd.api+json'}));
app.use(bodyParser.urlencoded({extended: true}));

app.use(methodOverride('X-HTTP-Method-Override'));

app.use(express.static(publicPath));

// ----- Get directory paths
app.use('/test', express.static(publicPath + '/test'));

// ----- CORS
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// ----- API
// Redirect to Index
app.all('/*', function (req, res) {
    // Just send the index.html for other files to support HTML5Mode
    res.sendFile('/index.html', {root: publicPath});
});

// ----- Start App
server.listen(port);        // Listen on port (./config/config.json.port)

console.log('[SERVER] Project started on port: ' + port);