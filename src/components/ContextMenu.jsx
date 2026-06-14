import React from "react";

const optionStyle = {
  padding: "8px 16px",
  cursor: "pointer",
  color: "#334155",
  fontSize: "14px",
  transition: "background-color 0.2s",
  // Note: To add hover effect dynamically in pure inline styles,
  // you would typically toggle a local component hover state,
  // or simply use a traditional CSS class.
};

export const ContextMenu = ({
  menuVisible,
  option,
  onAddNewFileOrFolder,
  position,
}) => {
  if (!menuVisible) {
    return null;
  }

  const options = [{ name: "file", isFile: true }, { name: "folder" }];

  return (
    <div
      style={{
        position: "absolute",
        top: `${position.y}px`,
        left: `${position.x}px`,
        backgroundColor: "#ffffff",
        boxShadow: "0px 4px 12px rgba(0,0,0,0.15)",
        borderRadius: "4px",
        padding: "5px 0",
        zIndex: 1000,
        border: "1px solid #e2e8f0",
        minWidth: "150px",
      }}
    >
      {options.map((item) => (
        <div
          key={item.name}
          onClick={() => onAddNewFileOrFolder({ ...option, ...item })}
          style={optionStyle}
        >
          {item.name}
        </div>
      ))}
    </div>
  );
};
