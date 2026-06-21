import { useState } from "react";
import { FileExplorer } from "./container/FileExplorer";
import { filesAndFolders } from "./data";
import "./styles.css";
import type { ExplorerAction, ExplorerNode } from "./types";
import { FileCode, FileJson, FileText, File, X } from "lucide-react";
import { NEW_FILE, NEW_FOLDER } from "./constant";

export const VSC = {
  editorBg: "#1e1e1e",
  sidebarBg: "#252526",
  tabInactive: "#2d2d2d",
  border: "#3c3c3c",
  fg: "#cccccc",
  fgBright: "#ffffff",
  fgMuted: "#8c8c8c",
  fgHeader: "#bbbbbb",
  accent: "#007acc",
  hover: "#2a2d2e",
  active: "#37373d",
} as const;

type VscColors = typeof VSC;

const isFolderNode = (node: ExplorerNode): node is Extract<ExplorerNode, { isFile: false }> =>
  !node.isFile;

const addObjectAtDepth = ({
  list, targetDepth, newObj, parentFolder, currentDepth = 0, nodeName = "",
}: {
  list: ExplorerNode[]; targetDepth: number; newObj: ExplorerNode;
  parentFolder: string; currentDepth?: number; nodeName?: string;
}): ExplorerNode[] => {
  if (!Array.isArray(list)) return list;
  if (currentDepth === targetDepth && nodeName === parentFolder) { list.push(newObj); return list; }
  list.forEach((node) => {
    if (isFolderNode(node)) addObjectAtDepth({ list: node.filesAndFolders, targetDepth, newObj, parentFolder, currentDepth: currentDepth + 1, nodeName: node.name });
  });
  return list;
};

const replaceObject = ({
  list, updatedObj,
}: {
  list: ExplorerNode[]; updatedObj: ExplorerNode;
}): ExplorerNode[] => {
  if (!Array.isArray(list)) return list;
  return list.map((node) => {
    if (updatedObj.id === node.id) return {...updatedObj};
    if (isFolderNode(node)) return { ...node, filesAndFolders: replaceObject({ list: node.filesAndFolders, updatedObj, }) };
    return node;
  });
};



const deleteObject = (list: ExplorerNode[], id: string): ExplorerNode[] => {
      return list.filter((node) => {
        if (node.id === id) return false;
        if (isFolderNode(node)) node.filesAndFolders = deleteObject(node.filesAndFolders, id);
        return true;
      });
    };

export function getFileIcon(name: string, size = 16) {
  const ext = name.split(".").pop()?.toLowerCase();
  const s = { width: size, height: size, flexShrink: 0 } as const;
  switch (ext) {
    case "ts": case "tsx": return <FileCode style={{ ...s, color: "#3178c6" }} />;
    case "js": case "jsx": return <FileCode style={{ ...s, color: "#e8c547" }} />;
    case "json": return <FileJson style={{ ...s, color: "#cbcb41" }} />;
    case "css": case "scss": return <File style={{ ...s, color: "#519aba" }} />;
    case "md": case "mdx": return <FileText style={{ ...s, color: "#519aba" }} />;
    default: return <File style={{ ...s, color: "#c5c5c5" }} />;
  }
}

type OpenFile = { name: string; content?: string };

export default function App() {
  const [list, setList] = useState<ExplorerNode[]>(filesAndFolders);
  const [openFiles, setOpenFiles] = useState<OpenFile[]>([]);
  const [activeFile, setActiveFile] = useState<string | null>(null);

  const onAddNewFileOrFolder = (option: ExplorerAction) => {
    const { parentFolder, name = "", depth, isFile } = option;
    const tempList = structuredClone(list) as ExplorerNode[];
    setList(addObjectAtDepth({
      list: tempList, targetDepth: depth, parentFolder,
      newObj: { name: `New ${name}`, ...(isFile ? { isFile: true as const, id: self.crypto.randomUUID() } : { filesAndFolders: [], isFile: false as const, id: self.crypto.randomUUID() }) },
    }));
  };

  const onNewFileOrFolderName = (option: ExplorerAction) => {
     const { name = "", id , item} = option;
    const tempList = structuredClone(list) as ExplorerNode[];
    setList(replaceObject({
      list: tempList,
      updatedObj: {...item, name, id, ...(option.currentName && { currentName: option.currentName })} as ExplorerNode,
    }));
  };

  const onDeleteFileOrFolder = (option: ExplorerAction) => {
    const { id, name } = option;
    if (confirm(`Are you sure you want to delete ${name}?`)) {
      const tempList = structuredClone(list) as ExplorerNode[];
      setList(deleteObject(tempList, id));
    }
  }

  const onOpenFile = (file: OpenFile) => {
    setActiveFile(file.name);
    setOpenFiles((prev) => prev.some((f) => f.name === file.name) ? prev : [...prev, file]);
  };

  const onCloseFile = (name: string) => {
    setOpenFiles((prev) => {
      const next = prev.filter((f) => f.name !== name);
      if (activeFile === name) setActiveFile(next.length > 0 ? next[next.length - 1].name : null);
      return next;
    });
  };

  const currentFile = openFiles.find((f) => f.name === activeFile);

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
                key={file.name}
                file={file}
                isActive={file.name === activeFile}
                onActivate={() => setActiveFile(file.name)}
                onClose={() => onCloseFile(file.name)}
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
  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
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
          <pre style={{ fontFamily: "'Cascadia Code', 'Fira Code', Consolas, monospace", fontSize: 14, lineHeight: 1.6, color: vsc.fg, margin: 0 }}>
            {file.content}
          </pre>
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
      <p style={{ color: vsc.fgMuted, fontSize: 13 }}>No editor is open</p>
      <p style={{ color: vsc.fgMuted, fontSize: 11, opacity: 0.5 }}>Right-click a folder in the explorer to create files</p>
    </div>
  );
}
