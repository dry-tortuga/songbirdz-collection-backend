const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

const indexRouter = require("./routes");
const indexStreamer = require("./streams");

const app = express();

app.use(cors({ origin: "*" }));
app.use(logger("tiny"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// initialize the API routes
app.use("/birds", indexRouter);

if ((process.env.NODE_ENV === 'staging' ||
	process.env.NODE_ENV === 'production') &&
	process.env.SONGBIRDZ_REACT_APP_BUILD) {

	app.use(express.static(process.env.SONGBIRDZ_REACT_APP_BUILD));

	app.get('/*', function (req, res) {
		res.sendFile(`${process.env.SONGBIRDZ_REACT_APP_BUILD}/index.html`);
	});

}

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {

	console.error(err);

	// render the error page
	res.status(err.status || 500);
	res.send("error");

});

// initialize the ws streaming
indexStreamer();

module.exports = app;
