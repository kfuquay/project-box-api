require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const { NODE_ENV } = require("./config");
const ProjectsService = require("./projects/projects-service");

const app = express();

const morganOption = NODE_ENV === "production" ? "tiny" : "common";

app.use(morgan(morganOption));
app.use(cors());
app.use(helmet());

app.get("/api/", (req, res) => {
  res.json({ ok: true });
});

app.get("/projects", (req, res, next) => {
  const knexInstance = req.app.get("db");
  ProjectsService.getAllProjects(knexInstance)
    .then(projects => {
      res.json(projects);
    })
    .catch(next);
});

app.get("/projects/:project_id", (req, res, next) => {
  const knexInstance = req.app.get("db");
  ProjectsService.getById(knexInstance, req.params.project_id)
    .then(project => {
      if (!project) {
        return res.status(404).json({
          error: { message: `Project does not exist` },
        });
      }
      res.json(project);
    })
    .catch(next);
});

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

module.exports = app;
