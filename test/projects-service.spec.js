const ProjectsService = require("../src/projects/projects-service");
const knex = require("knex");

describe(`Projects service object`, function() {
  let db;
  let testProjects = [
    {
      id: 1,
      title: "First test project!",
      summary:
        "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Natus consequuntur deserunt commodi, nobis qui inventore corrupti iusto aliquid debitis unde non.Adipisci, pariatur.Molestiae, libero esse hic adipisci autem neque ?",
    },
    {
      id: 2,
      title: "second test project",
      summary: "zzzz",
    },
    {
      id: 3,
      title: "third test project!!",
      summary: "okokok",
    },
  ];

  before(() => {
    db = knex({
      client: "pg",
      connection: process.env.TEST_DB_URL,
    });
  });

  //disconnect from the database at the end of all the tests
  after(() => db.destroy());

  //remove all the data from the table before we insert new test data
  before(() => db("projects").truncate());

  //remove all data after each test
  afterEach(() => db("projects").truncate());

  //context is functionally interchangable with describe, using context is more semantically appropriate here
  context(`Given 'projects' has data`, () => {
    //beforeEach test w/data, insert data (necessary as afterEach is cleaning out data)
    beforeEach(() => {
      return db.into("projects").insert(testProjects);
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
      };
      return ProjectsService.updateProject(db, idOfProjectToUpdate, newProjectData)
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
    it(`getAllProjects() resolves an empty array`, () => {
      return ProjectsService.getAllProjects(db).then(actual => {
        expect(actual).to.eql([]);
      });
    });
    it(`insertProject() inserts a new project and resolves the new project with an 'id'`, () => {
      const newProject = {
        title: "Test new title",
        summary: "Test new summary",
      };
      return ProjectsService.insertProject(db, newProject).then(actual => {
        expect(actual).to.eql({
          id: 1,
          title: newProject.title,
          summary: newProject.summary,
        });
      });
    });
  });
});
