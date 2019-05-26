const express = require("express");
const ProjectsService = require('./projects-services')
const { requireAuth } = require("../middleware/jwt-auth");

const projectsRouter = express.Router();

projectsRouter.route("/").get((req, res, next) => {
  ProjectsService.getAllProjects(req.app.get("db"))
    .then(projects => {
      res.json(ProjectsService.serializeProjects(projects));
    })
    .catch(next);
});

//should be protected endpoint - basic auth
projectsRouter
  .route("/:project_id")
  .all(requireAuth)
  .all(checkThingExists)
  .get((req, res) => {
    res.json(ProjectsService.serializeProject(res.thing));
  });

/* async/await syntax for promises */
async function checkProjectExists(req, res, next) {
  try {
    const project = await ProjectsService.getById(
      req.app.get("db"),
      req.params.project_id
    );

    if (!project)
      return res.status(404).json({
        error: `Project doesn't exist`
      });

    res.project = project;
    next();
  } catch (error) {
    next(error);
  }
}

module.exports = projectsRouter;
