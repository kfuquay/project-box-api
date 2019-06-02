const ProjectsService = {
  // getAllProjects(knex) {
  //   return knex.select("*").from("projects");
  // },
  // getAllProjects(db) {
  //   return db
  //     .from("projects")
  //     .select("projects.title", "projects.summary")
  //     .leftJoin("materials", "projects.id", "materials.project_id")
  //     .leftJoin("steps", "projects.id", "steps.project_id")
  //     .leftJoin("users", "projects.user_id", "users.id")
  //     .groupBy("projects.id");
  // },
  getAllProjects(knex) {
    return knex
      .select('*')
      .from("projects")
      // .leftJoin("materials as m", "projects.id", "m.project_id")
      // .groupBy("projects.id");
  },
  // getAllProjects(db) {
  //   return db.raw(
  //     `SELECT projects.title, projects.summary, materials.name, steps.name FROM projects JOIN materials ON materials.project_id = projects.id JOIN steps ON steps.project_id = projects.id;`
  //   );
  // },
  insertProject(knex, newProject) {
    return knex
      .insert(newProject.title, newProject.summary, newProject.user_id)
      .into("projects")
      .returning("*")
      .then(rows => {
        return rows[0];
      });
    //TODO something like newproject.materials.map(insert into materials) *NEED TO RETURN PROJECT_ID ABOVE AND INSERT INTO MATERIALS AND STEPS TABLES*
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
