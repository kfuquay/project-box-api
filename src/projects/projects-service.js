
const ProjectsService = {
  // getAllProjects(knex) {
  //   return knex.select("*").from("projects");
  // },
  getAllProjects(db) {
    return db
      .from("projects")
      .select("projects.id", "projects.title", "projects.summary",
      db.raw(`json_strip_nulls(json_build_object('id', projects.user_id)) AS "author"`),)
      .leftJoin("materials", "projects.id", "materials.project_id")
      .leftJoin("steps", "projects.id", "steps.project_id")
      .leftJoin('users', 'projects.user_id', 'users.id')
      .groupBy("projects.id");
  },
  insertProject(knex, newProject) {
    return knex
      .insert(newProject)
      .into("projects")
      .returning("*")
      .then(rows => {
        return rows[0];
      });
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
