import { PanelLeft, PanelRight } from "lucide-react";
import { memo, useCallback, useState } from "react";
import { EditorPane } from "./components/EditorPane";
import { FileTab } from "./components/FileTab";
import { VSC } from "./constant";
import { FileExplorer } from "./container/FileExplorer";
import { filesAndFolders } from "./data";
import { addObjectAtDepth, deleteObject, replaceObject } from "./lib/helper";
import "./styles.css";
import type { ExplorerAction, ExplorerNode, FileNode, VscColors } from "./types";


export default function App() {
  const [list, setList] = useState<ExplorerNode[]>(filesAndFolders);
  const [openFiles, setOpenFiles] = useState<FileNode[]>([]);
  const [activeFile, setActiveFile] = useState<FileNode | null>(null);
  const [activeFolder, setActiveFolder] = useState<ExplorerNode | null>(null);
  const [isPaneLeft, setIsPaneLeft] = useState<boolean>(true);


  const onAddNewFileOrFolder = useCallback((option: ExplorerAction) => {
    const { parentFolder, name = "", depth, isFile } = option;
    const tempList = structuredClone(list) as ExplorerNode[];
    setList(addObjectAtDepth({
      list: tempList, targetDepth: depth, parentFolder,
      newObj: { name: `New ${name}`, ...(isFile ? { isFile: true as const, id: self.crypto.randomUUID() } : { filesAndFolders: [], isFile: false as const, id: self.crypto.randomUUID() }) },
    }));
  }, [list]);

  const onNewFileOrFolderName = useCallback((option: ExplorerAction) => {
    const { name = "", id, item } = option;
    const tempList = structuredClone(list) as ExplorerNode[];
    const updatedObj = { ...item, name, id, ...(option.currentName && { currentName: option.currentName }) } as ExplorerNode;

    // if (hasRenameConflict({ list: tempList, updatedObj })) {
    //   alert(`A file or folder with the name "${updatedObj.name}" already exists in this folder.`);
    //   return;
    // }

    setList(replaceObject({
      list: tempList,
      updatedObj,
    }));
  }, [list]);

  const onDeleteFileOrFolder = useCallback((option: ExplorerAction) => {
    const { id, name } = option;
    if (confirm(`Are you sure you want to delete ${name}?`)) {
      const tempList = structuredClone(list) as ExplorerNode[];
      setList(deleteObject(tempList, id));
    }
  }, [list]);

  const onOpenFile = useCallback((file: FileNode) => {
    setActiveFile(file);
    setOpenFiles((prev) => prev.some((f) => f.id === file.id) ? prev : [...prev, file]);
  }, []);

  const onCloseFile = useCallback((id: string) => {
    setOpenFiles((prev) => {
      const next = prev.filter((f) => f.id !== id);
      if (activeFile?.id === id) setActiveFile(next.length > 0 ? next[next.length - 1] : null);
      return next;
    });
  }, [activeFile]);

  const currentFile = openFiles.find((f) => f.id === activeFile?.id);

  const sideBar = <aside style={{
    width: 240, minWidth: 240, display: "flex", flexDirection: "column",
    backgroundColor: VSC.sidebarBg, borderRight: `1px solid ${VSC.border}`,
    overflow: "hidden",
  }}>
    <div style={{
      height: 35, display: "flex", alignItems: "center", paddingLeft: 12, flexShrink: 0,
      fontSize: 11, fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase",
      color: VSC.fgHeader, borderBottom: `1px solid ${VSC.border}`, userSelect: "none",
      justifyContent: "space-between", gap: 4, paddingRight: 8,
    }}>
      Explorer

      {isPaneLeft ? <PanelLeft onClick={() => setIsPaneLeft(false)} /> : <PanelRight onClick={() => setIsPaneLeft(true)} />}
    </div>

    <div style={{ flex: 1, overflowY: "auto", overflowX: "hidden" }}>
      <FileExplorer
        list={list}
        onAddNewFileOrFolder={onAddNewFileOrFolder}
        onNewFileOrFolderName={onNewFileOrFolderName}
        onDeleteFileOrFolder={onDeleteFileOrFolder}
        setActiveFolder={setActiveFolder}
        depth={0}
        onOpenFile={onOpenFile}
        activeFile={activeFile}
      />
    </div>
  </aside>

  return (
    <div style={{ display: "flex", height: "100vh", width: "100vw", overflow: "hidden", backgroundColor: VSC.editorBg }}>
      {isPaneLeft && sideBar}
      <main style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", backgroundColor: VSC.editorBg }}>
        {openFiles.length > 0 && (
          <div style={{
            height: 35, display: "flex", alignItems: "stretch", flexShrink: 0,
            backgroundColor: VSC.sidebarBg, borderBottom: `1px solid ${VSC.border}`,
            overflowX: "auto", overflowY: "hidden",
            flexDirection: isPaneLeft ? "row" : "row-reverse",
          }}>
            {openFiles.map((file) => (
              <FileTab
                key={file.id}
                file={file}
                isActive={file.id === activeFile?.id}
                onActivate={() => setActiveFile(file)}
                onClose={() => onCloseFile(file.id)}
                onCloseAll={() => {
                  setOpenFiles([]);
                  setActiveFile(null);
                }}
                vsc={VSC}
              />
            ))}
          </div>
        )}

        <div style={{ flex: 1, overflow: "auto" }}>
          {currentFile ? (
            <EditorPane file={currentFile} vsc={VSC} />
          ) : (
            <EmptyState vsc={VSC} />
          )}
        </div>
      </main>
      {!isPaneLeft && sideBar}
    </div>
  );
}

const EmptyState = memo(({ vsc }: { vsc: VscColors }) => {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: 8 }}>
      <p style={{ color: vsc.fgMuted, fontSize: 13 }}>You can perform actions on files in the explorer</p>
      <p style={{ color: vsc.fgMuted, fontSize: 11, opacity: 0.5 }}>Right-click a folder in the explorer to create files</p>
      <p>Start Editing and playing around! with the editor!</p>
    </div>
  );
})
