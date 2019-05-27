const express = require("express");
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
    ProjectsService.insertProject(req.app.get("db"), newProject)
      .then(project => {
        res
          .status(201)
          .location(`/projects/${project.id}`)
          .json(project);
      })
      .catch(next);
  });

projectsRouter.route("/:project_id").get((req, res, next) => {
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

module.exports = projectsRouter;
