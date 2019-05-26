const { expect } = require("chai");
const knex = require("knex");
const app = require("../src/app");
const { makeProjectsArray } = require("./projects.fixtures");

describe.only(`projects endpoints`, function() {
  let db;

  before("make knex instance", () => {
    db = knex({
      client: "pg",
      connection: process.env.TEST_DB_URL,
    });
    app.set("db", db);
  });

  after("disconnect from db", () => db.destroy());

  before("clean the table", () => db("projects").truncate());

  afterEach("cleanup the table", () => db("projects").truncate());

  describe(`GET /projects`, () => {
    context(`Given no projects`, () => {
      it(`responds with 200 and an empty list`, () => {
        return supertest(app)
          .get("/projects")
          .expect(200, []);
      });
    });

    context("Given there are projects in the database", () => {
      const testProjects = makeProjectsArray();

      beforeEach("insert projects", () => {
        return db.into("projects").insert(testProjects);
      });

      it("responds with 200 and all of the projects", () => {
        return supertest(app)
          .get("/projects")
          .expect(200, testProjects);
      });
    });
  });

  describe(`GET /projects/:project_id`, () => {
    context("Given no projects", () => {
      it("responds with 404", () => {
        const projectId = 123455;
        return supertest(app)
          .get(`/projects/${projectId}`)
          .expect(404, { error: { message: `Project does not exist` } });
      });
    });
    context("Given there are projects in the database", () => {
      const testProjects = makeProjectsArray();

      beforeEach("insert projects", () => {
        return db.into("projects").insert(testProjects);
      });

      it("responds with 200 and the specified project", () => {
        const projectId = 2;
        const expectedProject = testProjects[projectId - 1];
        return supertest(app)
          .get(`/projects/${projectId}`)
          .expect(200, expectedProject);
      });
    });
  });
});
