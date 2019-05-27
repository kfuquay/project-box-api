function makeProjectsArray() {
  return [
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
    {
      id: 4,
      title: "FOURTH TITLE",
      summary: "summmmaryy",
    },
  ];
}

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

module.exports = {
  makeProjectsArray,
  makeMaliciousProject,
};
