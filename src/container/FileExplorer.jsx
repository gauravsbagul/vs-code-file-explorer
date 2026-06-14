import React, { useState, useEffect } from "react";
import FolderIcon from "./close-folder.png";
import FileIcon from "./file-1.png";
import { ContextMenu } from "../components/ContextMenu";

export const FileExplorer = ({ list, onAddNewFileOrFolder, level, setNewFileOrFolderName }) => {
  const [isExpanded, setIsExpanded] = useState({});
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [menuVisible, setMenuVisible] = useState(false);
  const [option, setOption] = useState({});

  const handleContextMenu = (e, option) => {
    e.preventDefault(); // Stop the default browser context menu

    // Capture the click coordinates
    setPosition({ x: e.pageX, y: e.pageY });
    setMenuVisible(true);
    setOption(option);
  };

  // 2. Hide the menu whenever the user clicks anywhere else
  useEffect(() => {
    const closeMenu = () => setMenuVisible(false);
    window.addEventListener("click", closeMenu);

    // Clean up event listener on unmount
    return () => window.removeEventListener("click", closeMenu);
  }, []);

  // 3. Define actions for your menu options
  const handleOptionClick = (option) => {
    alert(`You selected: ${option}`);
    setMenuVisible(false);
  };

  const onCreateNewFile = (e, index, item, isFile) => {
    const newName = e.target.value.trim();
    if (newName) {
      setNewFileOrFolderName({
        index,
        parentFolder: item.name,
        level: level,
        name: newName,
        isFile
      });
    }
  }

  return (
    <>
      <ContextMenu
        onAddNewFileOrFolder={onAddNewFileOrFolder}
        position={position}
        menuVisible={menuVisible}
        option={option}
      />
      <div className="folderWrapper">
        {list.map((item, index) => (
          <div key={`${item.name}-${level}`} className="item">
            {item.isFile ? (
              item.name === "New file" ? (
                <div>
                  <img src={FileIcon} style={{ height: 20, width: 20 }} />
                  <input
                    type="text"
                    placeholder="New File"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === "Enter") onCreateNewFile(e, index, item, true)
                    }}
                    onBlur={(e) => onCreateNewFile(e, index, item, true)}
                  />
                </div>
              ) : (
                <>
                  <img src={FileIcon} style={{ height: 20, width: 20 }} />
                  <span style={{ marginLeft: 5 }}>{item.name}</span>
                </>
              )
            ) : (
              item.name === "New folder" ? (
                <div>
                  <img src={FolderIcon} style={{ height: 20, width: 20 }} />
                  <input
                    type="text"
                    placeholder="New Folder"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === "Enter") onCreateNewFile(e, index, item, false)
                    }}
                    onBlur={(e) => onCreateNewFile(e, index, item, false)}
                  />
                </div>
              ) : (
                <div
                  onClick={() =>
                    setIsExpanded((prevState) => ({
                      ...prevState,
                      [item.name]: true,
                    }))
                  }
                  style={{ flexDirection: "row" }}
                  onContextMenu={(e) =>{
                    setIsExpanded((prevState) => ({
                      ...prevState,
                      [item.name]: !prevState[item.name],
                    }))
                    handleContextMenu(e, {
                      index,
                      parentFolder: item.name,
                      level: level + 1,
                    })
                 } }
                >
                  <img src={FolderIcon} style={{ height: 20, width: 20 }} />
                  <span style={{ marginLeft: 5 }}>{item.name}</span>
                </div>
              )
            )}
            {isExpanded[item.name] && item.filesAndFolders?.length ? (
              <FileExplorer
                list={item.filesAndFolders}
                onAddNewFileOrFolder={onAddNewFileOrFolder}
                level={level + 1}
                setNewFileOrFolderName={setNewFileOrFolderName}
              />
            ) : null}
          </div>
        ))}
      </div>
    </>
  );
};

const styles = {
  sideBar: {},
};
