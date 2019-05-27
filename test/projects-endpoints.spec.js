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

  describe.only(`GET /projects/:project_id`, () => {
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
    context(`Given an XSS attack project`, () => {
      const maliciousProject = {
        id: 911,
        title: 'Naughty naughty very naughty <script>alert("xss");</script>',
        summary: `Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad.`,
      };

      beforeEach("insert malicious project", () => {
        return db.into("projects").insert([maliciousProject]);
      });

      it("removes XSS attack content", () => {
        return supertest(app)
          .get(`/projects/${maliciousProject.id}`)
          .expect(200)
          .expect(res => {
            expect(res.body.title).to.eql(
              'Naughty naughty very naughty &lt;script&gt;alert("xss");&lt;/script&gt;'
            );
            expect(res.body.summary).to.eql(
              `Bad image <img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad.`
            );
          });
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
          expect(res.headers.location).to.eql(`/projects/${res.body.id}`);
        })
        .then(postRes =>
          supertest(app)
            .get(`/projects/${postRes.body.id}`)
            .expect(postRes.body)
        );
    });
    it(`responds with 400 and an error message when the 'title' is missing`, () => {
      return supertest(app)
        .post("/projects")
        .send({
          summary: "test summary",
        })
        .expect(400, {
          error: { message: `Missing 'title' in request body` },
        });
    });
  });
});
