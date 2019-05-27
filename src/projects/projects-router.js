const express = require("express");
const xss = require("xss");
const ProjectsService = require("./projects-service");

const projectsRouter = express.Router();
const jsonParser = express.json();

projectsRouter
  .route("/")
  .get((req, res, next) => {
    ProjectsService.getAllProjects(req.app.get("db"))
      .then(projects => {
        res.json(projects);
      })
      .catch(next);
  })
  .post(jsonParser, (req, res, next) => {
    const { title, summary } = req.body;
    const newProject = { title, summary };

    if (!title) {
      return res.status(400).json({
        error: { message: `Missing 'title' in request body` },
      });
    }
    ProjectsService.insertProject(req.app.get("db"), newProject)
      .then(project => {
        res
          .status(201)
          .location(`/projects/${project.id}`)
          .json(project);
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
    res.json({
      id: project.id,
      title: xss(project.title),
      summary: xss(project.summary),
    });
  })
  .delete((req, res, next) => {
    ProjectsService.deleteProject(req.app.get("db"), req.params.project_id)
      .then(() => {
        res.status(204).end();
      })
      .catch(next);
  });

module.exports = projectsRouter;
