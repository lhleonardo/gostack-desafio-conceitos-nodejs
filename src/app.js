const express = require("express");
const cors = require("cors");
const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const newRepo = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  };

  repositories.push(newRepo);

  return response.json(newRepo);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;

  if (!isUuid(id)) {
    return response.status(400).json({ error: "Invalid repo ID." });
  }

  const repoIndex = repositories.findIndex(
    (repository) => repository.id === id
  );

  if (repoIndex < 0) {
    return response.status(400).json({ error: "Invalid repo ID." });
  }

  const { title, url, techs } = request.body;

  const { likes } = repositories[repoIndex];

  const repository = { id, title, url, techs, likes };

  repositories[repoIndex] = repository;

  return response.json(repository);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  if (!isUuid(id)) {
    return response.status(400).json({ error: "Invalid repo ID." });
  }

  const repoIndex = repositories.findIndex(
    (repository) => repository.id === id
  );

  if (repoIndex < 0) {
    return response.status(400).json({ error: "Invalid repo ID." });
  }

  repositories.splice(repoIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  if (!isUuid(id)) {
    return response.status(400).json({ error: "Invalid repo ID." });
  }

  const repoIndex = repositories.findIndex(
    (repository) => repository.id === id
  );

  if (repoIndex < 0) {
    return response.status(400).json({ error: "Invalid repo ID." });
  }

  repositories[repoIndex].likes += 1;

  return response.json(repositories[repoIndex]);
});

module.exports = app;
