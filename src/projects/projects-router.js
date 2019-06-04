const path = require("path");
const express = require("express");
const xss = require("xss");
const ProjectsService = require("./projects-service");
const UsersService = require("../users/users-service");

const projectsRouter = express.Router();
const jsonParser = express.json();

const serializeProject = project => ({
  id: project.id,
  title: xss(project.title),
  summary: xss(project.summary),
  user_id: project.user_id,
  materials: project.materials,
  steps: project.steps,
});

projectsRouter
  .route("/")
  .get((req, res, next) => {
    const knexInstance = req.app.get("db");
    ProjectsService.getAllProjects(knexInstance)
      .then(projects => {
        res.json(projects.map(serializeProject));
      })
      .catch(next);
  })
  .post(jsonParser, (req, res, next) => {
    const { title, summary, materials, steps, user_id } = req.body;
    const newProject = { title, summary, materials, steps, user_id };
    console.log(newProject);

    if (!title) {
      return res.status(400).json({
        error: { message: `Missing 'title' in request body` },
      });
    }

    // newProject.user_id = user_id

    ProjectsService.insertProject(req.app.get("db"), newProject)
      .then(project => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl,`/${project.id}`))
          .json(serializeProject(project));
      })
      .catch(next);
  });

projectsRouter
  .route("/:project_id")
  .all((req, res, next) => {
    ProjectsService.getById(req.app.get("db"), req.params.project_id)
      .then(project => {
        if (!project) {
          return res.status(404).json({
            error: { message: `Project does not exist` },
          });
        }
        res.project = project;
        next();
      })
      .catch(next);
  })
  .get((req, res, next) => {
    res.json(serializeProject(res.project));
  })
  .delete((req, res, next) => {
    ProjectsService.deleteProject(req.app.get("db"), req.params.project_id)
      .then(numRowsAffected => {
        res.status(204).end();
      })
      .catch(next);
  });

module.exports = projectsRouter;
