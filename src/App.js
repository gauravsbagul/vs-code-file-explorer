import "./styles.css";
import { FileExplorer } from "./container/FileExplorer";
import { useEffect } from "react";
import { filesAndFolders } from "./data";
export default function App() {
  return (
    <div className="App">
      <FileExplorer list={filesAndFolders} />
    </div>
  );
}
