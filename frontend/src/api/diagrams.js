import apiClient from "./client";

export async function createDiagram(payload) {
  const response = await apiClient.post("/diagrams", payload);
  return response.data;
}

export async function listDiagrams() {
  const response = await apiClient.get("/diagrams");
  return response.data;
}

export async function getDiagramById(id) {
  const response = await apiClient.get(`/diagrams/${id}`);
  return response.data;
}

export async function updateDiagram(id, payload) {
  const response = await apiClient.put(`/diagrams/${id}`, payload);
  return response.data;
}

export async function deleteDiagram(id) {
  await apiClient.delete(`/diagrams/${id}`);
}
