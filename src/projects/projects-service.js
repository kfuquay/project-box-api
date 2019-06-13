const ProjectsService = {
  getAllProjects(knex) {
    return knex
      .select("projects.id", "projects.title", "projects.summary", "projects.materials", "projects.steps", "projects.user_id", "users.username")
      .from("projects")
      .leftJoin("users", "projects.user_id", "users.id");
  },
  insertProject(knex, newProject) {
    return knex
      .insert(newProject)
      .into("projects")
      .returning("*")
      .then(([project]) => project);
  },
  getById(knex, id) {
    return knex
      .from("projects")
      .select("*")
      .where("id", id)
      .first();
  },
  deleteProject(knex, id) {
    return knex("projects")
      .where({ id })
      .delete();
  },
  updateProject(knex, id, newProjectFields) {
    return knex("projects")
      .where({ id })
      .update(newProjectFields);
  },
};

module.exports = ProjectsService;
