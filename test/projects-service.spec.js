const ProjectsService = require("../src/projects/projects-service");
const knex = require("knex");
const { makeProjectsArray, makeUsersArray } = require("./test-helpers");

describe(`Projects service object`, function() {
  let db;
  const testUsers = makeUsersArray();
  const testProjects = makeProjectsArray();

  before(() => {
    db = knex({
      client: "pg",
      connection: process.env.TEST_DB_URL,
    });
  });

  //disconnect from the database at the end of all the tests
  after(() => db.destroy());

  //remove all the data from the table before we insert new test data
  before("clean the table", () =>
    db.raw(
      "TRUNCATE projects, users RESTART IDENTITY CASCADE"
    )
  );

  //remove all data after each test
  afterEach("cleanup the table", () =>
    db.raw(
      "TRUNCATE projects, users RESTART IDENTITY CASCADE"
    )
  );
  //context is functionally interchangable with describe, using context is more semantically appropriate here
  context(`Given 'projects' has data`, () => {
    //beforeEach test w/data, insert data (necessary as afterEach is cleaning out data)
    beforeEach("insert projects", () => {
      return db
        .into("users")
        .insert(testUsers)
        .then(() => {
          return db.into("projects").insert(testProjects);
        });
    });

    it(`getAllProjects() resolves all articles from 'projects' table`, () => {
      return ProjectsService.getAllProjects(db).then(actual => {
        expect(actual).to.eql(testProjects);
      });
    });
    it(`getById() resolves a project by id from 'projects' table`, () => {
      const thirdId = 3;
      const thirdTestProject = testProjects[thirdId - 1];
      return ProjectsService.getById(db, thirdId).then(actual => {
        expect(actual).to.eql({
          id: thirdId,
          title: thirdTestProject.title,
          summary: thirdTestProject.summary,
          user_id: thirdTestProject.user_id,
          materials: thirdTestProject.materials,
          steps: thirdTestProject.steps,
        });
      });
    });
    it(`deleteProject() removes a project by id from 'projects' table`, () => {
      const projectId = 3;
      return ProjectsService.deleteProject(db, projectId)
        .then(() => ProjectsService.getAllProjects(db))
        .then(allProjects => {
          const expected = testProjects.filter(
            project => project.id !== projectId
          );
          expect(allProjects).to.eql(expected);
        });
    });
    it(`updateProject() updates a project from the 'projects' table`, () => {
      const idOfProjectToUpdate = 3;
      const newProjectData = {
        title: "updated title",
        summary: "updated summary",
        user_id: 1,
        materials: ['update', 'update'],
        steps: ['update', 'update'],
      };
      return ProjectsService.updateProject(
        db,
        idOfProjectToUpdate,
        newProjectData
      )
        .then(() => ProjectsService.getById(db, idOfProjectToUpdate))
        .then(project => {
          expect(project).to.eql({
            id: idOfProjectToUpdate,
            ...newProjectData,
          });
        });
    });
  });

  context(`Given 'projects' had no data`, () => {
    beforeEach("insert projects", () => {
      return db.into("users").insert(testUsers);
    });

    it(`getAllProjects() resolves an empty array`, () => {
      return ProjectsService.getAllProjects(db).then(actual => {
        expect(actual).to.eql([]);
      });
    });
    it(`insertProject() inserts a new project and resolves the new project with an 'id'`, () => {
      const newProject = {
        title: "Test new title",
        summary: "Test new summary",
        user_id: 1,
        materials: ['test'],
        steps: ['test step', 'test step two'],
      };
      return ProjectsService.insertProject(db, newProject).then(actual => {
        expect(actual).to.eql({
          id: 1,
          title: newProject.title,
          summary: newProject.summary,
          user_id: newProject.user_id,
          materials: newProject.materials,
          steps: newProject.steps
        });
      });
    });
  });
});
