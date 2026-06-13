import "./styles.css";
import { FileExplorer } from "./container/FileExplorer";
import { useState } from "react";
import { filesAndFolders } from "./data";

const addObjectAtDepth = (list, targetDepth, newObj, currentDepth = 0) => {
  if (!list || !Array.isArray(list)) return list;

  if (currentDepth === targetDepth) {
    list.push(newObj);
    return list;
  }

  // Traverse deeper into children
  list.forEach((node) => {
    if (node.children) {
      const list = addObjectAtDepth(
        node.children,
        targetDepth,
        newObj,
        currentDepth + 1
      );
    }
  });
  return list;
};

export default function App() {
  const [list, setList] = useState(filesAndFolders);

  const onAddNewFileOrFlder = (option) => {
    console.log("option", option);
    const { parentFolder, index, name, level, isFile } = option;
    const tempList = JSON.parse(JSON.stringify(list));

    const newList = addObjectAtDepth(tempList, level, {
      name: `New ${name}`,
      isFile,
    });
    console.log("newList ~->", newList);
    setList(newList);
  };

  return (
    <div className="App">
      <div className="sideBar">
        <FileExplorer
          list={filesAndFolders}
          onAddNewFileOrFlder={onAddNewFileOrFlder}
          level={0}
        />
      </div>
    </div>
  );
}
