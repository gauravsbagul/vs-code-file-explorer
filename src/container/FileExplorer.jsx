import React, { useState } from "react";

export const FileExplorer = ({ list }) => {
  const [isExpanded, setIsExpanded] = useState({});
  console.log("isExpanded", isExpanded);
  return (
    <div className="sideBar">
      {list.map((item) => (
        <div key={item.name} className="item">
          {item.isFile ? (
            <span>{item.name}</span>
          ) : (
            <div
              onClick={() =>
                setIsExpanded((prevState) => ({
                  ...prevState,
                  [item.name]: !prevState[item.name],
                }))
              }
              style={{ flexDirection: "row" }}
            >
              {!isExpanded[item.name] ? "+" : "-"} <span>{item.name}</span>
            </div>
          )}
          {isExpanded[item.name] && item.filesAndFolders?.length ? (
            <FileExplorer list={item.filesAndFolders} />
          ) : null}
        </div>
      ))}
    </div>
  );
};

const styles = {
  sideBar: {},
};
