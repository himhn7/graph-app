import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  MarkerType,
  addEdge,
  useEdgesState,
  useNodesState
} from "reactflow";
import "reactflow/dist/style.css";
import {
  createDiagram,
  deleteDiagram,
  getDiagramById,
  listDiagrams,
  updateDiagram
} from "../api/diagrams";
import CloudNode from "../components/CloudNode";
import Toolbar from "../components/Toolbar";
import DiagramList from "../components/DiagramList";
import ContextMenu from "../components/ContextMenu";

const defaultViewport = { x: 0, y: 0, zoom: 1 };

function getErrorMessage(error, fallback) {
  return error?.response?.data?.message || fallback;
}

function EditorPage() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [diagrams, setDiagrams] = useState([]);
  const [title, setTitle] = useState("Untitled Diagram");
  const [selectedDiagramId, setSelectedDiagramId] = useState(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [saveLoading, setSaveLoading] = useState(false);
  const [listLoading, setListLoading] = useState(false);
  const [loadLoading, setLoadLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [contextMenu, setContextMenu] = useState(null);
  const editorShellRef = useRef(null);

  const nodeTypes = useMemo(
    () => ({
      cloudNode: CloudNode
    }),
    []
  );

  const refreshDiagrams = useCallback(async () => {
    setListLoading(true);
    try {
      const data = await listDiagrams();
      setDiagrams(data);
    } catch (err) {
      setError(getErrorMessage(err, "Failed to fetch diagrams."));
    } finally {
      setListLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshDiagrams();
  }, [refreshDiagrams]);

  const addNode = useCallback(
    (nodeType) => {
      const id =
        typeof crypto !== "undefined" && crypto.randomUUID
          ? crypto.randomUUID()
          : `node-${Date.now()}-${Math.round(Math.random() * 1000)}`;
      const count = nodes.length + 1;
      const labelMap = {
        generic: `Generic ${count}`,
        ec2: `EC2 ${count}`,
        vpc: `VPC ${count}`,
        db: `DB ${count}`
      };
      setNodes((current) => [
        ...current,
        {
          id,
          type: "cloudNode",
          position: {
            x: 120 + current.length * 30,
            y: 100 + current.length * 18
          },
          data: {
            label: labelMap[nodeType] || `Node ${count}`,
            nodeType
          }
        }
      ]);
    },
    [nodes.length, setNodes]
  );

  const onConnect = useCallback(
    (connection) =>
      setEdges((existing) =>
        addEdge(
          {
            ...connection,
            markerEnd: { type: MarkerType.ArrowClosed }
          },
          existing
        )
      ),
    [setEdges]
  );

  const onNodeDoubleClick = useCallback(
    (event, node) => {
      const nextLabel = window.prompt("Update node label", node.data?.label || "");
      if (!nextLabel || !nextLabel.trim()) {
        return;
      }

      setNodes((current) =>
        current.map((item) =>
          item.id === node.id
            ? {
                ...item,
                data: {
                  ...item.data,
                  label: nextLabel.trim()
                }
              }
            : item
        )
      );
    },
    [setNodes]
  );

  const toLocalCoords = useCallback((event) => {
    const rect = editorShellRef.current?.getBoundingClientRect();
    if (!rect) {
      return { x: event.clientX, y: event.clientY };
    }
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    };
  }, []);

  const openNodeContextMenu = useCallback((event, node) => {
    event.preventDefault();
    const local = toLocalCoords(event);
    setContextMenu({
      x: local.x,
      y: local.y,
      type: "node",
      id: node.id
    });
  }, [toLocalCoords]);

  const openEdgeContextMenu = useCallback((event, edge) => {
    event.preventDefault();
    const local = toLocalCoords(event);
    setContextMenu({
      x: local.x,
      y: local.y,
      type: "edge",
      id: edge.id
    });
  }, [toLocalCoords]);

  const deleteFromContextMenu = useCallback(() => {
    if (!contextMenu) {
      return;
    }

    if (contextMenu.type === "node") {
      setNodes((current) => current.filter((node) => node.id !== contextMenu.id));
      setEdges((current) =>
        current.filter(
          (edge) =>
            edge.source !== contextMenu.id && edge.target !== contextMenu.id
        )
      );
    } else if (contextMenu.type === "edge") {
      setEdges((current) => current.filter((edge) => edge.id !== contextMenu.id));
    }

    setContextMenu(null);
  }, [contextMenu, setEdges, setNodes]);

  const createNewDiagram = useCallback(() => {
    setNodes([]);
    setEdges([]);
    setTitle("Untitled Diagram");
    setSelectedDiagramId(null);
    setMessage("Started a new blank diagram.");
    setError("");
    if (reactFlowInstance) {
      reactFlowInstance.setViewport(defaultViewport);
    }
  }, [reactFlowInstance, setEdges, setNodes]);

  const saveDiagram = useCallback(async () => {
    if (!title.trim()) {
      setError("Diagram title is required.");
      return;
    }

    setSaveLoading(true);
    setError("");
    setMessage("");
    try {
      const payload = {
        title: title.trim(),
        graph_json: {
          nodes,
          edges,
          viewport: reactFlowInstance
            ? reactFlowInstance.getViewport()
            : defaultViewport
        }
      };

      let saved;
      if (selectedDiagramId) {
        saved = await updateDiagram(selectedDiagramId, payload);
        setMessage("Diagram updated.");
      } else {
        saved = await createDiagram(payload);
        setSelectedDiagramId(saved.id);
        setMessage("Diagram saved.");
      }
      await refreshDiagrams();
    } catch (err) {
      setError(getErrorMessage(err, "Failed to save diagram."));
    } finally {
      setSaveLoading(false);
    }
  }, [
    title,
    nodes,
    edges,
    reactFlowInstance,
    selectedDiagramId,
    refreshDiagrams
  ]);

  const loadDiagram = useCallback(
    async (id) => {
      setLoadLoading(true);
      setError("");
      setMessage("");
      try {
        const data = await getDiagramById(id);
        setSelectedDiagramId(data.id);
        setTitle(data.title);
        setNodes(data.graph_json?.nodes || []);
        setEdges(data.graph_json?.edges || []);
        setMessage(`Loaded diagram #${data.id}.`);

        if (reactFlowInstance && data.graph_json?.viewport) {
          requestAnimationFrame(() => {
            reactFlowInstance.setViewport(data.graph_json.viewport, {
              duration: 250
            });
          });
        }
      } catch (err) {
        setError(getErrorMessage(err, "Failed to load diagram."));
      } finally {
        setLoadLoading(false);
      }
    },
    [reactFlowInstance, setEdges, setNodes]
  );

  const handleDeleteDiagram = useCallback(
    async (id) => {
      setDeletingId(id);
      setError("");
      setMessage("");
      try {
        await deleteDiagram(id);
        if (id === selectedDiagramId) {
          createNewDiagram();
        }
        await refreshDiagrams();
        setMessage(`Deleted diagram #${id}.`);
      } catch (err) {
        setError(getErrorMessage(err, "Failed to delete diagram."));
      } finally {
        setDeletingId(null);
      }
    },
    [selectedDiagramId, createNewDiagram, refreshDiagrams]
  );

  return (
    <main className="layout">
      <Toolbar
        onAddNode={addNode}
        onNewDiagram={createNewDiagram}
        onSave={saveDiagram}
        saveLoading={saveLoading}
        title={title}
        onChangeTitle={setTitle}
      />
      <section className="content">
        <DiagramList
          diagrams={diagrams}
          loading={listLoading}
          selectedId={selectedDiagramId}
          onLoad={loadDiagram}
          onDelete={handleDeleteDiagram}
          deletingId={deletingId}
        />
        <div className="editor-shell" ref={editorShellRef}>
          <div className="status-bar">
            {loadLoading ? <span>Loading diagram...</span> : <span>Ready</span>}
            {message ? <span className="ok-text">{message}</span> : null}
            {error ? <span className="error-text">{error}</span> : null}
          </div>
          <div className="editor">
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onNodeDoubleClick={onNodeDoubleClick}
              onNodeContextMenu={openNodeContextMenu}
              onEdgeContextMenu={openEdgeContextMenu}
              onPaneClick={() => setContextMenu(null)}
              onInit={setReactFlowInstance}
              nodeTypes={nodeTypes}
              fitView
            >
              <MiniMap pannable zoomable />
              <Controls />
              <Background gap={18} size={1.2} />
            </ReactFlow>
          </div>
          {contextMenu ? (
            <ContextMenu
              x={contextMenu.x}
              y={contextMenu.y}
              type={contextMenu.type}
              onDelete={deleteFromContextMenu}
              onClose={() => setContextMenu(null)}
            />
          ) : null}
        </div>
      </section>
    </main>
  );
}

export default EditorPage;
