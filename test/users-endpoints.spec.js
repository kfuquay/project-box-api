const knex = require("knex");
const app = require("../src/app");
const helpers = require("./test-helpers");

describe("Users Endpoints", function() {
  let db;
  const { testUsers } = helpers.makeProjectsFixtures();
  let testUser = testUsers[0];

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

  describe(`POST /api/users`, () => {
    context(`User Validation`, () => {
      beforeEach("insert users", () => {
        return db
        .into("users")
        .insert(testUsers)
      });

      const requiredFields = ["username", "password"];

      requiredFields.forEach(field => {
        const registerAttemptBody = {
          username: "test user_name",
          password: "test password",
        };

        it(`responds with 400 required error when '${field}' is missing`, () => {
          delete registerAttemptBody[field];

          return supertest(app)
            .post("/api/users")
            .send(registerAttemptBody)
            .expect(400, {
              error: `Missing '${field}' in request body`,
            });
        });

        it(`responds 400 'Password must be longer than 8 characters' when no password`, () => {
          const userShortPassword = {
            username: "test username",
            password: "1234567",
          };
          return supertest(app)
            .post("/api/users")
            .send(userShortPassword)
            .expect(400, {
              error: `Password must be longer than 8 characters`,
            });
        });
        it(`responds 400 'Password must be less than seventy-eight characters' when long password`, () => {
          const userLongPassword = {
            username: "test user_name",
            password: "*".repeat(73),
          };
          return supertest(app)
            .post("/api/users")
            .send(userLongPassword)
            .expect(400, {
              error: `Password must be less than seventy-two characters`,
            });
        });
        it(`responds 400 error when password starts with spaces`, () => {
          const userPasswordStartsSpaces = {
            username: "test user_name",
            password: " 1Aa!2Bb@",
          };
          return supertest(app)
            .post("/api/users")
            .send(userPasswordStartsSpaces)
            .expect(400, {
              error: `Password must not start or end with a space`,
            });
        });

        it(`responds 400 error when password ends with spaces`, () => {
          const userPasswordEndsSpaces = {
            username: "test user_name",
            password: "1Aa!2Bb@ ",
          };
          return supertest(app)
            .post("/api/users")
            .send(userPasswordEndsSpaces)
            .expect(400, {
              error: `Password must not start or end with a space`,
            });
        });

        it(`responds 400 error when password isn't complex enough`, () => {
          const userPasswordNotComplex = {
            username: "test user_name",
            password: "11AAaabb",
          };
          return supertest(app)
            .post("/api/users")
            .send(userPasswordNotComplex)
            .expect(400, {
              error: `Password must contain at least one uppercase, lowercase, number and special character`,
            });
        });
        it.only(`responds 400 'User name already taken' when user_name isn't unique`, () => {
          const duplicateUser = {
            username: testUser.username,
            password: "11AAaa!!",
          };
          return supertest(app)
            .post("/api/users")
            .send(duplicateUser)
            .expect(400, { error: `Username already taken` });
        });
      });
    });
  });
});
