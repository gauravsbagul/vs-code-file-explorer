import { X } from "lucide-react";
import { useCallback, useEffect, useId, useState } from "react";
import { VSC } from "./constant";
import { FileExplorer } from "./container/FileExplorer";
import { filesAndFolders } from "./data";
import { addObjectAtDepth, deleteObject, getFileIcon, replaceObject } from "./lib/helper";
import "./styles.css";
import type { ExplorerAction, ExplorerNode, FileNode } from "./types";


type VscColors = typeof VSC;

type OpenFile = { name: string; content?: string, id: string };

export default function App() {
  const [list, setList] = useState<ExplorerNode[]>(filesAndFolders);
  const [openFiles, setOpenFiles] = useState<FileNode[]>([]);
  const [activeFile, setActiveFile] = useState<FileNode | null>(null);
  const [activeFolder, setActiveFolder] = useState<ExplorerNode | null>(null);

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

  return (
    <div style={{ display: "flex", height: "100vh", width: "100vw", overflow: "hidden", backgroundColor: VSC.editorBg }}>

      <aside style={{
        width: 240, minWidth: 240, display: "flex", flexDirection: "column",
        backgroundColor: VSC.sidebarBg, borderRight: `1px solid ${VSC.border}`,
        overflow: "hidden",
      }}>
        <div style={{
          height: 35, display: "flex", alignItems: "center", paddingLeft: 12, flexShrink: 0,
          fontSize: 11, fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase",
          color: VSC.fgHeader, borderBottom: `1px solid ${VSC.border}`, userSelect: "none",
        }}>
          Explorer
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

      <main style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", backgroundColor: VSC.editorBg }}>
        {openFiles.length > 0 && (
          <div style={{
            height: 35, display: "flex", alignItems: "stretch", flexShrink: 0,
            backgroundColor: VSC.sidebarBg, borderBottom: `1px solid ${VSC.border}`,
            overflowX: "auto", overflowY: "hidden",
          }}>
            {openFiles.map((file) => (
              <FileTab
                key={file.id}
                file={file}
                isActive={file.id === activeFile?.id}
                onActivate={() => setActiveFile(file)}
                onClose={() => onCloseFile(file.id)}
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
    </div>
  );
}

function FileTab({ file, isActive, onActivate, onClose, vsc }: {
  file: OpenFile; isActive: boolean;
  onActivate: () => void; onClose: () => void;
  vsc: VscColors;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onActivate}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex", alignItems: "center", gap: 6,
        padding: "0 10px", height: "100%", flexShrink: 0,
        cursor: "pointer", border: "none", outline: "none", fontSize: 13,
        whiteSpace: "nowrap", borderRight: `1px solid ${vsc.border}`,
        borderTop: `1px solid ${isActive ? vsc.accent : "transparent"}`,
        backgroundColor: isActive ? vsc.editorBg : (hovered ? vsc.hover : vsc.tabInactive),
        color: isActive ? vsc.fgBright : vsc.fgMuted,
        transition: "background-color 0.1s",
      }}
    >
      {getFileIcon(file.name)}
      <span>{file.name}</span>
      <span
        role="button"
        onClick={(e) => { e.stopPropagation(); onClose(); }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = vsc.active; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "transparent"; }}
        style={{
          display: "flex", alignItems: "center", justifyContent: "center",
          width: 20, height: 20, borderRadius: 3, marginLeft: 2,
          opacity: hovered || isActive ? 1 : 0, cursor: "pointer",
          backgroundColor: "transparent", color: vsc.fgMuted,
          transition: "opacity 0.1s",
        }}
      >
        <X width={14} height={14} />
      </span>
    </button>
  );
}

function EditorPane({ file, vsc }: { file: OpenFile; vsc: VscColors }) {
  const postTextAreaId = useId();
  const [content, setContent] = useState("");


  useEffect(() => {
    setContent(file.content || "");
  }, [file.id]);

  return (
    <div key={file.id} style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{
        height: 22, display: "flex", alignItems: "center", gap: 4,
        paddingLeft: 12, fontSize: 13, color: vsc.fg, flexShrink: 0,
        borderBottom: `1px solid ${vsc.border}`,
      }}>
        {getFileIcon(file.name)}
        <span>{file.name}</span>
      </div>
      <div style={{ flex: 1, padding: "20px 28px", overflow: "auto" }}>
        {file.content ? (
          <div style={{
            flex: 1, display: "flex", flexDirection: "row",
          }}>
            <div>
              {Array.from({ length: 50 }, (_, i) => i + 1).map((n) => (
                <p style={{ display: "block", lineHeight: 1.6, fontSize: 14, color: vsc.fgMuted }}>{n}</p>
              ))}
            </div>
            <textarea
              id={postTextAreaId}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              style={{
                marginLeft: 10, padding: 0,
                width: "100%", height: "100%",
                fontFamily: "'Cascadia Code', 'Fira Code', Consolas, monospace",
                fontSize: 14, lineHeight: 1.6, color: vsc.fg,
                backgroundColor: "transparent", border: "none", outline: "none",
                resize: "none",
              }}
              name="postContent"
              rows={1000}
              cols={50}
            />
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "calc(100vh - 100px)", gap: 8, opacity: 0.4 }}>
            <span style={{ color: vsc.fgMuted, fontSize: 13 }}>{file.name} — no content</span>
          </div>
        )}
      </div>
    </div>
  );
}

function EmptyState({ vsc }: { vsc: VscColors }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: 8 }}>
      <p style={{ color: vsc.fgMuted, fontSize: 13 }}>You can perform actions on files in the explorer</p>
      <p style={{ color: vsc.fgMuted, fontSize: 11, opacity: 0.5 }}>Right-click a folder in the explorer to create files</p>
      <p>Start Editing and playing around! with the editor!</p>
    </div>
  );
}
