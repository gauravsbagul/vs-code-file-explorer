import React, { useState, useEffect } from "react";
import FolderIcon from "./close-folder.png";
import FileIcon from "./file-1.png";
import { ContextMenu } from "../components/ContextMenu";

export const FileExplorer = ({ list, onAddNewFileOrFlder, level }) => {
  console.log("level", level);
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

  return (
    <>
      <ContextMenu
        onAddNewFileOrFlder={onAddNewFileOrFlder}
        position={position}
        menuVisible={menuVisible}
        option={option}
      />
      <div className="folderWrapper">
        {list.map((item, index) => (
          <div key={`${item.name}-${level}`} className="item">
            {item.isFile ? (
              <>
                <img src={FileIcon} style={{ height: 20, width: 20 }} />
                <span style={{ marginLeft: 5 }}>{item.name}</span>
              </>
            ) : (
              <div
                onClick={() =>
                  setIsExpanded((prevState) => ({
                    ...prevState,
                    [item.name]: !prevState[item.name],
                  }))
                }
                style={{ flexDirection: "row" }}
                onContextMenu={(e) =>
                  handleContextMenu(e, {
                    index,
                    parentFolder: item.name,
                    level: level,
                  })
                }
              >
                <img src={FolderIcon} style={{ height: 20, width: 20 }} />
                <span style={{ marginLeft: 5 }}>{item.name}</span>
              </div>
            )}
            {isExpanded[item.name] && item.filesAndFolders?.length ? (
              <FileExplorer
                list={item.filesAndFolders}
                onAddNewFileOrFlder={onAddNewFileOrFlder}
                level={index}
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
