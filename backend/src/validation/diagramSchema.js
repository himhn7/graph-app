const { z } = require("zod");

const viewportSchema = z.object({
  x: z.number(),
  y: z.number(),
  zoom: z.number()
});

const nodePositionSchema = z.object({
  x: z.number(),
  y: z.number()
});

const nodeSchema = z.object({
  id: z.string().min(1),
  type: z.string().optional(),
  position: nodePositionSchema,
  data: z.object({
    label: z.string().min(1)
  }).passthrough()
}).passthrough();

const edgeSchema = z.object({
  id: z.string().min(1),
  source: z.string().min(1),
  target: z.string().min(1),
  type: z.string().optional(),
  markerEnd: z.any().optional()
}).passthrough();

const graphSchema = z.object({
  nodes: z.array(nodeSchema),
  edges: z.array(edgeSchema),
  viewport: viewportSchema
});

const createDiagramSchema = z.object({
  title: z.string().trim().min(1).max(255),
  graph_json: graphSchema
});

const updateDiagramSchema = z.object({
  title: z.string().trim().min(1).max(255).optional(),
  graph_json: graphSchema.optional()
}).refine((value) => value.title !== undefined || value.graph_json !== undefined, {
  message: "At least one of title or graph_json must be provided."
});

module.exports = {
  createDiagramSchema,
  updateDiagramSchema
};
