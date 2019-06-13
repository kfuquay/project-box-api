const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

function makeUsersArray() {
  return [
    {
      id: 1,
      username: "dunder",
      password: "dunder",
    },
    {
      id: 2,
      username: "test",
      password: "test",
    },
  ];
}

function makeProjectsArray() {
  return [
    {
      id: 1,
      title: "First test project!",
      summary:
        "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Natus consequuntur deserunt commodi, nobis qui inventore corrupti iusto aliquid debitis unde non.Adipisci, pariatur.Molestiae, libero esse hic adipisci autem neque ?",
      user_id: 1,
      materials: ["one", "two"],
      steps: ["one", "two"],
    },
    {
      id: 2,
      title: "second test project",
      summary: "zzzz",
      user_id: 1,
      materials: ["one", "two"],
      steps: ["one", "two"],
    },
    {
      id: 3,
      title: "third test project!!",
      summary: "okokok",
      user_id: 2,
      materials: ["one", "two"],
      steps: ["one", "two"],
    },
    {
      id: 4,
      title: "FOURTH TITLE",
      summary: "summmmaryy",
      user_id: 2,
      materials: ["one", "two"],
      steps: ["one", "two"],
    },
  ];
}

const expectedReturnGetAllProjects = [
  {
    id: 1,
    title: "First test project!",
    summary:
      "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Natus consequuntur deserunt commodi, nobis qui inventore corrupti iusto aliquid debitis unde non.Adipisci, pariatur.Molestiae, libero esse hic adipisci autem neque ?",
    user_id: 1,
    materials: ["one", "two"],
    steps: ["one", "two"],
    id: 1,
    username: "dunder",
    password: "dunder",
  },
  {
    id: 2,
    title: "second test project",
    summary: "zzzz",
    user_id: 1,
    materials: ["one", "two"],
    steps: ["one", "two"],
    id: 1,
    username: "dunder",
    password: "dunder",
  },
  {
    id: 3,
    title: "third test project!!",
    summary: "okokok",
    user_id: 2,
    materials: ["one", "two"],
    steps: ["one", "two"],
    id: 2,
    username: "test",
    password: "test",
  },
  {
    id: 4,
    title: "FOURTH TITLE",
    summary: "summmmaryy",
    user_id: 2,
    materials: ["one", "two"],
    steps: ["one", "two"],
    id: 2,
    username: "test",
    password: "test",
  },
];

const expectedDeleteResults = [
  {
    id: 1,
    title: "First test project!",
    summary:
      "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Natus consequuntur deserunt commodi, nobis qui inventore corrupti iusto aliquid debitis unde non.Adipisci, pariatur.Molestiae, libero esse hic adipisci autem neque ?",
    user_id: 1,
    materials: ['one', 'two'],
    steps: ['one', 'two'],
    id: 1,
    username: 'dunder'
  },
  {
    id: 3,
    title: "third test project!!",
    summary: "okokok",
    user_id: 2,
    materials: ['one', 'two'],
    steps: ['one', 'two'],
    id: 2,
    username: 'test'
  },
  {
    id: 4,
    title: "FOURTH TITLE",
    summary: "summmmaryy",
    user_id: 2,
    materials: ['one', 'two'],
    steps: ['one', 'two'],
    id: 2,
    username: 'test'
  },
];

const expectedDeleteResultsRaw = [
  {
    id: 1,
    title: "First test project!",
    summary:
      "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Natus consequuntur deserunt commodi, nobis qui inventore corrupti iusto aliquid debitis unde non.Adipisci, pariatur.Molestiae, libero esse hic adipisci autem neque ?",
    user_id: 1,
    materials: ['one', 'two'],
    steps: ['one', 'two'],
    id: 1,
    username: 'dunder',
    password: 'dunder'
  },
  {
    id: 3,
    title: "third test project!!",
    summary: "okokok",
    user_id: 2,
    materials: ['one', 'two'],
    steps: ['one', 'two'],
    id: 2,
    username: 'test',
    password: 'test'
  },
  {
    id: 4,
    title: "FOURTH TITLE",
    summary: "summmmaryy",
    user_id: 2,
    materials: ['one', 'two'],
    steps: ['one', 'two'],
    id: 2,
    username: 'test',
    password: 'test'
  },
];

const expectedProjects = [
  {
    id: 1,
    title: "First test project!",
    summary:
      "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Natus consequuntur deserunt commodi, nobis qui inventore corrupti iusto aliquid debitis unde non.Adipisci, pariatur.Molestiae, libero esse hic adipisci autem neque ?",
    user_id: 1,
    materials: ["one", "two"],
    steps: ["one", "two"],
    id: 1,
    username: "dunder",
  },
  {
    id: 2,
    title: "second test project",
    summary: "zzzz",
    user_id: 1,
    materials: ["one", "two"],
    steps: ["one", "two"],
    id: 1,
    username: "dunder",
  },
  {
    id: 3,
    title: "third test project!!",
    summary: "okokok",
    user_id: 2,
    materials: ["one", "two"],
    steps: ["one", "two"],
    id: 2,
    username: "test",
  },
  {
    id: 4,
    title: "FOURTH TITLE",
    summary: "summmmaryy",
    user_id: 2,
    materials: ["one", "two"],
    steps: ["one", "two"],
    id: 2,
    username: "test",
  },
];

function makeMaliciousProject() {
  const maliciousProject = {
    id: 911,
    title: 'Naughty naughty very naughty <script>alert("xss");</script>',
    summary: `Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad.`,
  };
  const expectedProject = {
    ...maliciousProject,
    title:
      'Naughty naughty very naughty &lt;script&gt;alert("xss");&lt;/script&gt;',
    summary: `Bad image <img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad.`,
  };
  return {
    maliciousProject,
    expectedProject,
  };
}

function makeProjectsFixtures() {
  const testUsers = makeUsersArray();
  const testProjects = makeProjectsArray(testUsers);
  return { testUsers, testProjects };
}

function cleanTables(db) {
  return db.raw(
    `TRUNCATE
    users, projects RESTART IDENTITY CASCADE`
  );
}

function seedUsers(db, users) {
  const preppedUsers = users.map(user => ({
    ...user,
    password: bcrypt.hashSync(user.password, 1),
  }));
  return db
    .into("users")
    .insert(preppedUsers)
    .then(() =>
      // update the auto sequence to stay in sync
      db.raw(`SELECT setval('users_id_seq', ?)`, [users[users.length - 1].id])
    );
}

function seedProjectsTables(db, users, projects) {
  // use a transaction to group the queries and auto rollback on any failure
  return db.transaction(async trx => {
    await seedUsers(trx, users);
    await trx.into("projects").insert(projects);
    // update the auto sequence to match the forced id values
    await trx.raw(`SELECT setval('projects_id_seq', ?)`, [
      projects[projects.length - 1].id,
    ]);
  });
}

function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
  const token = jwt.sign({ user_id: user.id }, secret, {
    subject: user.username,
    algorithm: "HS256",
  });
  return `Bearer ${token}`;
}

module.exports = {
  expectedReturnGetAllProjects,
  expectedDeleteResults,
  expectedDeleteResultsRaw,
  makeAuthHeader,
  seedProjectsTables,
  seedUsers,
  cleanTables,
  makeUsersArray,
  makeProjectsArray,
  makeMaliciousProject,
  makeProjectsFixtures,
  expectedProjects,
};
