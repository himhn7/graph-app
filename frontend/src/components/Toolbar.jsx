const NODE_TYPES = [
  { key: "generic", label: "Generic Node" },
  { key: "ec2", label: "EC2" },
  { key: "vpc", label: "VPC" },
  { key: "db", label: "DB" }
];

function Toolbar({
  onAddNode,
  onNewDiagram,
  onSave,
  saveLoading,
  title,
  onChangeTitle
}) {
  return (
    <section className="toolbar">
      <div className="toolbar-left">
        <button type="button" className="btn btn-outline" onClick={onNewDiagram}>
          New Diagram
        </button>
        {NODE_TYPES.map((item) => (
          <button
            key={item.key}
            type="button"
            className="btn btn-soft"
            onClick={() => onAddNode(item.key)}
          >
            + {item.label}
          </button>
        ))}
      </div>
      <div className="toolbar-right">
        <input
          className="title-input"
          value={title}
          onChange={(event) => onChangeTitle(event.target.value)}
          placeholder="Diagram title"
        />
        <button
          type="button"
          className="btn btn-primary"
          onClick={onSave}
          disabled={saveLoading}
        >
          {saveLoading ? "Saving..." : "Save Diagram"}
        </button>
      </div>
    </section>
  );
}

export default Toolbar;
