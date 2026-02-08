const diagramService = require("../services/diagramService");
const {
  createDiagramSchema,
  updateDiagramSchema
} = require("../validation/diagramSchema");

function parseId(rawId) {
  const id = Number(rawId);
  return Number.isInteger(id) && id > 0 ? id : null;
}

async function createDiagram(req, res, next) {
  try {
    const payload = createDiagramSchema.parse(req.body);
    const diagram = await diagramService.createDiagram(payload);
    res.status(201).json(diagram);
  } catch (err) {
    next(err);
  }
}

async function listDiagrams(req, res, next) {
  try {
    const diagrams = await diagramService.listDiagrams();
    res.json(diagrams);
  } catch (err) {
    next(err);
  }
}

async function getDiagram(req, res, next) {
  try {
    const id = parseId(req.params.id);
    if (!id) {
      return res.status(400).json({ message: "Invalid diagram id." });
    }

    const diagram = await diagramService.getDiagramById(id);
    if (!diagram) {
      return res.status(404).json({ message: "Diagram not found." });
    }

    res.json(diagram);
  } catch (err) {
    next(err);
  }
}

async function updateDiagram(req, res, next) {
  try {
    const id = parseId(req.params.id);
    if (!id) {
      return res.status(400).json({ message: "Invalid diagram id." });
    }

    const payload = updateDiagramSchema.parse(req.body);
    const diagram = await diagramService.updateDiagram(id, payload);

    if (!diagram) {
      return res.status(404).json({ message: "Diagram not found." });
    }

    res.json(diagram);
  } catch (err) {
    next(err);
  }
}

async function deleteDiagram(req, res, next) {
  try {
    const id = parseId(req.params.id);
    if (!id) {
      return res.status(400).json({ message: "Invalid diagram id." });
    }

    const deleted = await diagramService.deleteDiagram(id);
    if (!deleted) {
      return res.status(404).json({ message: "Diagram not found." });
    }

    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createDiagram,
  listDiagrams,
  getDiagram,
  updateDiagram,
  deleteDiagram
};
