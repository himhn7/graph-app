import { Handle, Position } from "reactflow";

const typeStyles = {
  generic: { bg: "#ffffff", border: "#25324b" },
  ec2: { bg: "#ffe2bf", border: "#9a5115" },
  vpc: { bg: "#caefff", border: "#0e5d7e" },
  db: { bg: "#d2ffd9", border: "#1e7f3a" }
};

function NodeIcon({ type, borderColor }) {
  if (type === "db") {
    return (
      <span className="icon-db" style={{ borderColor }}>
        <span className="icon-db-top" style={{ borderColor }} />
        <span className="icon-db-body" style={{ borderColor }} />
        <span className="icon-db-bottom" style={{ borderColor }} />
      </span>
    );
  }

  if (type === "ec2") {
    return (
      <span className="icon-ec2" style={{ borderColor }}>
        <span />
        <span />
        <span />
        <span />
      </span>
    );
  }

  if (type === "vpc") {
    return (
      <span className="icon-vpc" style={{ borderColor }}>
        <span />
        <span />
        <span />
      </span>
    );
  }

  return <span className="icon-generic" style={{ borderColor }}>N</span>;
}

function CloudNode({ data }) {
  const style = typeStyles[data.nodeType] || typeStyles.generic;

  return (
    <div
      className="cloud-node"
      style={{ backgroundColor: style.bg, borderColor: style.border }}
    >
      <Handle type="target" position={Position.Left} className="node-handle" />
      <div className="cloud-node-icon-wrap">
        <NodeIcon type={data.nodeType} borderColor={style.border} />
      </div>
      <div className="cloud-node-label">{data.label}</div>
      <Handle type="source" position={Position.Right} className="node-handle" />
    </div>
  );
}

export default CloudNode;
