import { Handle, Position } from "reactflow";

const typeStyles = {
  generic: { bg: "#ffffff", border: "#25324b", icon: "N" },
  ec2: { bg: "#ffe2bf", border: "#9a5115", icon: "EC2" },
  vpc: { bg: "#caefff", border: "#0e5d7e", icon: "VPC" },
  db: { bg: "#d2ffd9", border: "#1e7f3a", icon: "DB" }
};

function CloudNode({ data }) {
  const style = typeStyles[data.nodeType] || typeStyles.generic;

  return (
    <div
      className="cloud-node"
      style={{ backgroundColor: style.bg, borderColor: style.border }}
    >
      <Handle type="target" position={Position.Left} />
      <div className="cloud-node-icon" style={{ borderColor: style.border }}>
        {style.icon}
      </div>
      <div className="cloud-node-label">{data.label}</div>
      <Handle type="source" position={Position.Right} />
    </div>
  );
}

export default CloudNode;
