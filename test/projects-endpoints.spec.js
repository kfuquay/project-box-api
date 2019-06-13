const { expect } = require("chai");
const knex = require("knex");
const app = require("../src/app");
const {
  makeProjectsArray,
  makeMaliciousProject,
  makeUsersArray,
  expectedProjects,
} = require("./test-helpers");
const helpers = require("./test-helpers");

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

  before("clean the table", () => helpers.cleanTables(db));

  afterEach("cleanup the table", () => helpers.cleanTables(db));

  describe(`GET /api/projects`, () => {
    context(`Given no projects`, () => {
      it(`responds with 200 and an empty list`, () => {
        return supertest(app)
          .get("/api/projects")
          .expect(200, []);
      });
    });

    context("Given there are projects in the database", () => {
      const testUsers = makeUsersArray();
      const testProjects = makeProjectsArray();

      beforeEach("insert projects", () => {
        return db
          .into("users")
          .insert(testUsers)
          .then(() => {
            return db.into("projects").insert(testProjects);
          });
      });

      it("responds with 200 and all of the projects", () => {
        return supertest(app)
          .get("/api/projects")
          .expect(200, expectedProjects);
      });
    });
    context("Given an XSS attack project", () => {
      const { maliciousProject, expectedProject } = makeMaliciousProject();

      beforeEach("insert malicious project", () => {
        return db.into("projects").insert([maliciousProject]);
      });

      it("removes XSS attack content", () => {
        return supertest(app)
          .get(`/api/projects`)
          .expect(200)
          .expect(res => {
            expect(res.body[0].title).to.eql(expectedProject.title);
            expect(res.body[0].summary).to.eql(expectedProject.summary);
          });
      });
    });
  });
  describe(`GET /api/projects/:project_id`, () => {
    context("Given no projects", () => {
      it("responds with 404", () => {
        const projectId = 123455;
        return supertest(app)
          .get(`/api/projects/${projectId}`)
          .expect(404, { error: { message: `Project does not exist` } });
      });
    });
    context("Given there are projects in the database", () => {
      const testUsers = makeUsersArray();
      const testProjects = makeProjectsArray();

      beforeEach("insert projects", () => {
        return db
          .into("users")
          .insert(testUsers)
          .then(() => {
            return db.into("projects").insert(testProjects);
          });
      });
      it("responds with 200 and the specified project", () => {
        const projectId = 2;
        const expectedProject = {
          id: 2,
          title: "second test project",
          summary: "zzzz",
          user_id: 1,
          materials: ["one", "two"],
          steps: ["one", "two"],
          username: "",
        };
        return supertest(app)
          .get(`/api/projects/${projectId}`)
          .expect(200, expectedProject);
      });
    });
    context(`Given an XSS attack project`, () => {
      const { maliciousProject, expectedProject } = makeMaliciousProject();

      beforeEach("insert malicious project", () => {
        return db.into("projects").insert([maliciousProject]);
      });

      it("removes XSS attack content", () => {
        return supertest(app)
          .get(`/api/projects/${maliciousProject.id}`)
          .expect(200)
          .expect(res => {
            expect(res.body.title).to.eql(expectedProject.title);
            expect(res.body.summary).to.eql(expectedProject.summary);
          });
      });
    });
  });

  describe(`POST /api/projects`, () => {
    const testUsers = makeUsersArray();
    const testProjects = makeProjectsArray();
    beforeEach("insert projects", () => {
      return db.into("users").insert(testUsers);
    });
    it(`creates a project, responding with 201 and the new project`, function() {
      const newProject = {
        title: "test",
        summary: "test summary",
        materials: ["test"],
        steps: ["test"],
      };
      return supertest(app)
        .post("/api/projects")
        .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
        .send(newProject)
        .expect(201)
        .expect(res => {
          expect(res.body.title).to.eql(newProject.title);
          expect(res.body.summary).to.eql(newProject.summary);
          expect(res.body).to.have.property("id");
          expect(res.headers.location).to.eql(`/api/projects/${res.body.id}`);
        })
        .then(postRes =>
          supertest(app)
            .get(`/api/projects/${postRes.body.id}`)
            .expect(postRes.body)
        );
    });
    it(`responds with 400 and an error message when the 'title' is missing`, () => {
      return supertest(app)
        .post("/api/projects")
        .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
        .send({
          summary: "test summary",
        })
        .expect(400, {
          error: { message: `Missing 'title' in request body` },
        });
    });
    it("removes XSS attack content from response", () => {
      const { maliciousProject, expectedProject } = makeMaliciousProject();
      return supertest(app)
        .post("/api/projects")
        .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
        .send(maliciousProject)
        .expect(201)
        .expect(res => {
          expect(res.body.title).to.eql(expectedProject.title);
          expect(res.body.summary).to.eql(expectedProject.summary);
        });
    });
  });

  describe(`DELETE /api/projects/:project_id`, () => {
    context("Given there are projects in the database", () => {
      const testUsers = makeUsersArray();
      const testProjects = makeProjectsArray();

      beforeEach("insert projects", () => {
        return db
          .into("users")
          .insert(testUsers)
          .then(() => {
            return db.into("projects").insert(testProjects);
          });
      });

      it("responds with 204 and removes the project", () => {
        const idToRemove = 2;

        return supertest(app)
          .delete(`/api/projects/${idToRemove}`)
          .expect(204)
          .then(res =>
            supertest(app)
              .get(`/api/projects`)
              .expect(helpers.expectedDeleteResults)
          );
      });
    });
    context("Given no projects", () => {
      it("responds with 404", () => {
        const projectId = 98765545;
        return supertest(app)
          .delete(`/api/projects/${projectId}`)
          .expect(404, { error: { message: `Project does not exist` } });
      });
    });
  });
});
