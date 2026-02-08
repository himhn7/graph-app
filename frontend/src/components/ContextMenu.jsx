function ContextMenu({ x, y, type, onDelete, onClose }) {
  return (
    <>
      <button
        type="button"
        aria-label="Close context menu"
        className="context-backdrop"
        onClick={onClose}
      />
      <div className="context-menu" style={{ top: y, left: x }}>
        <button type="button" className="context-item" onClick={onDelete}>
          Delete {type}
        </button>
      </div>
    </>
  );
}

export default ContextMenu;
