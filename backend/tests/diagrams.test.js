process.env.NODE_ENV = "test";

const fs = require("fs");
const path = require("path");
const request = require("supertest");
const app = require("../src/app");
const pool = require("../src/db/pool");

const migrationsDir = path.resolve(__dirname, "../migrations");

const graphJson = {
  nodes: [
    {
      id: "node-1",
      type: "generic",
      position: { x: 100, y: 100 },
      data: { label: "Node 1" }
    }
  ],
  edges: [],
  viewport: { x: 0, y: 0, zoom: 1 }
};

beforeAll(async () => {
  const files = fs
    .readdirSync(migrationsDir)
    .filter((file) => file.endsWith(".sql"))
    .sort();

  for (const file of files) {
    const sql = fs.readFileSync(path.join(migrationsDir, file), "utf8");
    await pool.query(sql);
  }
});

beforeEach(async () => {
  await pool.query("TRUNCATE TABLE diagrams RESTART IDENTITY CASCADE");
});

afterAll(async () => {
  await pool.end();
});

describe("Diagram CRUD API", () => {
  test("creates a new diagram", async () => {
    const response = await request(app).post("/api/diagrams").send({
      title: "My Diagram",
      graph_json: graphJson
    });

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body.title).toBe("My Diagram");
    expect(response.body.graph_json.nodes).toHaveLength(1);
  });

  test("lists diagrams metadata", async () => {
    await request(app).post("/api/diagrams").send({
      title: "A",
      graph_json: graphJson
    });
    await request(app).post("/api/diagrams").send({
      title: "B",
      graph_json: graphJson
    });

    const response = await request(app).get("/api/diagrams");
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveLength(2);
    expect(response.body[0]).not.toHaveProperty("graph_json");
    expect(response.body[0]).toHaveProperty("updated_at");
  });

  test("gets one diagram by id", async () => {
    const created = await request(app).post("/api/diagrams").send({
      title: "Load me",
      graph_json: graphJson
    });

    const response = await request(app).get(`/api/diagrams/${created.body.id}`);
    expect(response.statusCode).toBe(200);
    expect(response.body.title).toBe("Load me");
    expect(response.body.graph_json.viewport.zoom).toBe(1);
  });

  test("updates title and graph_json", async () => {
    const created = await request(app).post("/api/diagrams").send({
      title: "Before",
      graph_json: graphJson
    });

    const updatedGraph = {
      ...graphJson,
      nodes: [
        ...graphJson.nodes,
        {
          id: "node-2",
          type: "db",
          position: { x: 220, y: 120 },
          data: { label: "Database" }
        }
      ]
    };

    const response = await request(app)
      .put(`/api/diagrams/${created.body.id}`)
      .send({
        title: "After",
        graph_json: updatedGraph
      });

    expect(response.statusCode).toBe(200);
    expect(response.body.title).toBe("After");
    expect(response.body.graph_json.nodes).toHaveLength(2);
  });

  test("deletes diagram", async () => {
    const created = await request(app).post("/api/diagrams").send({
      title: "Delete me",
      graph_json: graphJson
    });

    const deleteResponse = await request(app).delete(
      `/api/diagrams/${created.body.id}`
    );
    expect(deleteResponse.statusCode).toBe(204);

    const fetchDeleted = await request(app).get(`/api/diagrams/${created.body.id}`);
    expect(fetchDeleted.statusCode).toBe(404);
  });
});
