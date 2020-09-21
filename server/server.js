#!/usr/bin/env node

var defaultConfig = {
	db_path: null,
	http_port: 1337,
	session_driver: 'default',
	secret: null,
	auto_save: false
};

var express = require("express"),
	http = require("http"),
	path = require("path"),
	fs = require("fs"),
	nunjucks = require("nunjucks"),
	passport = require("passport"),
	Strategy = require("passport-local").Strategy,
	session = require("express-session"),
	redis = require('redis'),
	redisStore = require('connect-redis')(session),
	cookieParser = require("cookie-parser"),
	bodyParser = require("body-parser"),
	init = require("./includes/init.js"),
	database = require("./includes/database.js"),
	users = require("./includes/users.js"),
	config = require("./config/config.json"),
	package = require("./package.json"),
	routes = require("./routes/index.js");

const { v4: uuidv4 } = require('uuid');

config = {...defaultConfig, ...config};

const VERSION = package.version;

var app,
	httpServer


var initAuth = function() {

	passport.use(new Strategy(function(username, password, cb) {
		users.authenticate(username, password)
			.then(function(user) {
				cb(null, user);
				return;
			})
			.catch(function(err) {
				console.error("Auth: error: " + err);
				return cb(null, false);
			});
	}));

	passport.serializeUser(function(user, cb) {
		cb(null, user.id);
	});

	passport.deserializeUser(function(id, cb) {
		users.getById(id)
			.then(function(user) {
				delete user.password;
				cb(null, user);
			})
			.catch(function() {
				cb(false);
			});
	});

}


var initServers = function() {

	app = express();

	// Directories
	//

	app.use(express.static(path.join(__dirname, "public")));
	app.use("/uploads", express.static(path.join(process.cwd(), "data", "uploads")));

	// Parsers
	//

	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({ extended: true, limit: 50 * 1024 * 1024 }));
	app.use(cookieParser());

	// Authentication/sessions
	//

	var sessionConfig = {
		name: 'livinglab',
		secret: config.secret,
		resave: false,
		saveUninitialized: false
	}

	if (config.session_driver === 'redis') {

		var redisClient = redis.createClient();
		redisClient.on('error', function(err) {
		  console.error('Redis error: ', err);
		});

		sessionConfig.genid = function(req) {
			return uuidv4();
		}

		sessionConfig.store = new redisStore({
			host: 'localhost',
			port: 6379,
			client: redisClient,
		});
	}

	app.use(session(sessionConfig));
	app.use(passport.initialize());
	app.use(passport.session());

	// Nunjucks templating
	//
	var nunjucksEnv = nunjucks.configure(path.join(__dirname, 'views'), {
		// watch: true,
		noCache: true,
		autoescape: true,
		express: app
	});

	// Set some local variables for template use
	//
	app.use(function(req, res, next) {
		res.locals.app_version = VERSION;
		res.locals.user = (req.user ? req.user : null);
		res.locals.authenticated = (req.user);
		res.locals.auto_save = config.auto_save;
		res.locals.single_instance = config.single_instance;
		res.locals.fathom_site_id = config.fathom_site_id ? config.fathom_site_id : false;
		next();
	});

	// Create server
	//
	httpServer = http.Server(app);

	httpServer.listen(config.http_port, function() {
		console.log("Living Lab CoSMoS HTTP server running on port " + config.http_port);
	});

}


// Initialise dirs/database/users
//
init();
users.init();
initAuth();
initServers();

// Set up routes
//
routes.forEach(function(route) {
	console.log("Registering route " + route.method.toUpperCase() + " " + route.route);
	app[route.method](route.route, route.handler);
});
