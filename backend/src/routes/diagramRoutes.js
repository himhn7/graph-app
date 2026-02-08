const express = require("express");
const controller = require("../controllers/diagramController");

const router = express.Router();

router.post("/", controller.createDiagram);
router.get("/", controller.listDiagrams);
router.get("/:id", controller.getDiagram);
router.put("/:id", controller.updateDiagram);
router.delete("/:id", controller.deleteDiagram);

module.exports = router;
