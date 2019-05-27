const { expect } = require("chai");
const knex = require("knex");
const app = require("../src/app");
const { makeProjectsArray } = require("./projects.fixtures");

describe(`projects endpoints`, function() {
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

  describe(`POST /projects`, () => {
    it(`creates a project, responding with 201 and the new project`, function() {
      const newProject = {
        title: "test",
        summary: "test summary",
      };
      return supertest(app)
        .post("/projects")
        .send(newProject)
        .expect(res => {
          expect(res.body.title).to.eql(newProject.title);
          expect(res.body.summary).to.eql(newProject.summary);
          expect(res.body).to.have.property("id");
          expect(res.headers.location).to.eql(`/projects/${res.body.id}`)
        })
        .then(postRes =>
          supertest(app)
            .get(`/projects/${postRes.body.id}`)
            .expect(postRes.body)
        );
    });
  });
});
