function DiagramList({
  diagrams,
  loading,
  selectedId,
  onLoad,
  onDelete,
  deletingId
}) {
  return (
    <aside className="diagram-list">
      <h2>Saved Diagrams</h2>
      {loading && <p className="muted">Loading diagrams...</p>}
      {!loading && diagrams.length === 0 && (
        <p className="muted">No diagrams yet.</p>
      )}
      <ul>
        {diagrams.map((diagram) => (
          <li
            key={diagram.id}
            className={selectedId === diagram.id ? "selected" : ""}
          >
            <button
              type="button"
              className="diagram-item"
              onClick={() => onLoad(diagram.id)}
            >
              <span className="diagram-title">{diagram.title}</span>
              <span className="diagram-meta">ID: {diagram.id}</span>
              <span className="diagram-meta">
                Updated: {new Date(diagram.updated_at).toLocaleString()}
              </span>
            </button>
            <button
              type="button"
              className="btn btn-danger"
              onClick={() => onDelete(diagram.id)}
              disabled={deletingId === diagram.id}
            >
              {deletingId === diagram.id ? "Deleting..." : "Delete"}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}

export default DiagramList;
