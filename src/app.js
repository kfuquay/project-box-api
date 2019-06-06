require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const { CLIENT_ORIGIN } = require("./config");
const helmet = require("helmet");
const { NODE_ENV } = require("./config");
const projectsRouter = require("./projects/projects-router");
const usersRouter = require("./users/users-router");
const authRouter = require("./auth/auth-router");

const app = express();

const morganOption = NODE_ENV === "production" ? "tiny" : "common";

app.use(morgan(morganOption));
app.use(cors({ origin: CLIENT_ORIGIN }));
// app.use(function(req, res, next) {
//   var oneof = false;
//   if(req.headers.origin) {
//       res.header('Access-Control-Allow-Origin', req.headers.origin);
//       oneof = true;
//   }
//   if(req.headers['access-control-request-method']) {
//       res.header('Access-Control-Allow-Methods', req.headers['access-control-request-method']);
//       oneof = true;
//   }
//   if(req.headers['access-control-request-headers']) {
//       res.header('Access-Control-Allow-Headers', req.headers['access-control-request-headers']);
//       oneof = true;
//   }
//   if(oneof) {
//       res.header('Access-Control-Max-Age', 60 * 60 * 24 * 365);
//   }
app.use(function(req, res) {
  res.setHeader(
    "Access-Control-Allow-Origin",
    "https://project-box-ims3hchxt.now.sh/"
  );
  res.end()
});
// intercept OPTIONS method
//   if (oneof && req.method == 'OPTIONS') {
//       res.send(200);
//   }
//   else {
//       next();
//   }
// });

app.use(helmet());

app.use("/api/projects", projectsRouter);
app.use("/api/users", usersRouter);
app.use("/api/auth", authRouter);

app.use(function errorHandler(error, req, res, next) {
  let response;
  if (NODE_ENV === "production") {
    response = { error: { message: "server error" } };
  } else {
    console.error(error);
    response = { message: error.message, error };
  }
  res.status(500).json(response);
});

app.get("/api/", (req, res) => {
  res.json({ ok: true });
});

module.exports = app;
