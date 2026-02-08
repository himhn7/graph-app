const pool = require("../db/pool");

async function createDiagram({ title, graph_json }) {
  const { rows } = await pool.query(
    `
      INSERT INTO diagrams (title, graph_json)
      VALUES ($1, $2::jsonb)
      RETURNING id, title, graph_json, created_at, updated_at
    `,
    [title, JSON.stringify(graph_json)]
  );
  return rows[0];
}

async function listDiagrams() {
  const { rows } = await pool.query(
    `
      SELECT id, title, created_at, updated_at
      FROM diagrams
      ORDER BY updated_at DESC
    `
  );
  return rows;
}

async function getDiagramById(id) {
  const { rows } = await pool.query(
    `
      SELECT id, title, graph_json, created_at, updated_at
      FROM diagrams
      WHERE id = $1
    `,
    [id]
  );
  return rows[0] || null;
}

async function updateDiagram(id, payload) {
  const existing = await getDiagramById(id);
  if (!existing) {
    return null;
  }

  const title = payload.title ?? existing.title;
  const graphJson = payload.graph_json ?? existing.graph_json;

  const { rows } = await pool.query(
    `
      UPDATE diagrams
      SET title = $1, graph_json = $2::jsonb
      WHERE id = $3
      RETURNING id, title, graph_json, created_at, updated_at
    `,
    [title, JSON.stringify(graphJson), id]
  );

  return rows[0];
}

async function deleteDiagram(id) {
  const { rowCount } = await pool.query("DELETE FROM diagrams WHERE id = $1", [id]);
  return rowCount > 0;
}

module.exports = {
  createDiagram,
  listDiagrams,
  getDiagramById,
  updateDiagram,
  deleteDiagram
};
