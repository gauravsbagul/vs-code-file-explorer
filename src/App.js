import "./styles.css";
import { FileExplorer } from "./container/FileExplorer";
import { useState } from "react";
import { filesAndFolders } from "./data";

const addObjectAtDepth = (list, targetDepth, newObj,parentFolder, currentDepth = 0) => {
  if (!list || !Array.isArray(list)) return list;
  
  if (currentDepth === targetDepth ) {
    list.push(newObj);
    return list;
  }

  // Traverse deeper into filesAndFolders
  list.forEach((node) => {
    if (node.filesAndFolders) {
      const list = addObjectAtDepth(
        node.filesAndFolders,
        targetDepth,
        newObj,
        parentFolder,
        currentDepth + 1
      );
    }
  });
  return list;
};

const replaceObjectAtDepth = (list, targetDepth, newObj, currentDepth = 0) => {
  if (!Array.isArray(list)) return list;

  return list.map((node) => {
    if (currentDepth === targetDepth) {
      return node.name === "New file" || node.name === "New folder" ? newObj : node;
    }

    if (node.filesAndFolders) {
      return {
        ...node,
        filesAndFolders: replaceObjectAtDepth(
          node.filesAndFolders,
          targetDepth,
          newObj,
          currentDepth + 1
        ),
      };
    }

    return node;
  });
};


export default function App() {
  const [list, setList] = useState(filesAndFolders);

  const onAddNewFileOrFolder = (option) => {
    console.log("option", option);
    const { parentFolder, index, name, level, isFile } = option;
    const tempList = JSON.parse(JSON.stringify(list));

    const newList = addObjectAtDepth(tempList, level, {
      name: `New ${name}`,
      ...(isFile ? { isFile: true } : { filesAndFolders: [], isFile: false })
    }, parentFolder);
    setList(newList);
  };

  const setNewFileOrFolderName = (option) => {
    const { parentFolder, index, name, level, isFile } = option;
    const tempList = JSON.parse(JSON.stringify(list));

    const newList = replaceObjectAtDepth(tempList, level, {
      name: name,
      ...(isFile ? { isFile: true } : { filesAndFolders: [], isFile: false })
    });
    setList(newList);
  };

  return (
    <div className="App">
      <div className="sideBar">
        <FileExplorer
          list={list}
          onAddNewFileOrFolder={onAddNewFileOrFolder}
          level={0}
          setNewFileOrFolderName={setNewFileOrFolderName}
        />
      </div>
    </div>
  );
}
